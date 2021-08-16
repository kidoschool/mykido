<?php
// require_once '../model/auth.php';
// $conn = (new Auth())->conn;
// include_once 'common_functions.php';
// printr(fees_to_be_paid([9],"2020-2021"));die;
if(!isset($_POST['api'])){
    return print_r("Api name is not defined.");
}
//--------------API NAME => CLASS , METHOD ------------------
$apis = 
[   'get_stud_unassigned_class'=>'get_stud_unassigned_class',
    'get_class_subject'=>'get_class_subject',
    'set_stud_unassigned_class'=>'set_stud_unassigned_class',
    'daily_att_overview'=>'daily_att_overview',
    'insert_assignment' => 'insert_assignment',
    'get_assignment_for_stutent'=>'get_assignment_for_stutent',
    'get_assig_by_teacher'=>'get_assig_by_teacher',
    'get_assign_user' => 'get_assign_user',
    'update_assignments_user'=>'update_assignments_user',
    'get_fee'=>'get_fee',
    'insert_fee_institute_class'=>'insert_fee_institute_class',
    'get_fee_details'=>'get_fee_details',
    'pay_fees'=>'pay_fees',
    'set_fund_income'=>'set_fund_income',
    'get_fee_ignore_with_students'=>'get_fee_ignore_with_students',
    'set_fee_ignore_user'=>'set_fee_ignore_user',
    'get_fee_fine'=>'get_fee_fine',
    'set_fee_fine'=>'set_fee_fine',
    'user_fee_details'=>'user_fee_details',
    'fee_pending_report'=>'fee_pending_report',
    'fee_overall_rpt'=>'fee_overall_rpt',
    'get_staff_details'=>'get_staff_details',
    'set_expenses'=>'set_expenses',
    'get_salary_particular'=>'get_salary_particular',
    'set_salary_particular'=>'set_salary_particular',
    'set_expense_staff_pay_scale'=>'set_expense_staff_pay_scale',
    'get_expense_staff_pay_scale'=>'get_expense_staff_pay_scale',
    'get_all_staff_pay_scale'=>'get_all_staff_pay_scale',
    'get_all_extra_fields'=>'get_all_extra_fields',
];
//----------------------INVALID API ENDPINT CHECK---------------
if(!in_array($_POST['api'],$apis)){return print_r("Api name is not defined.");}
//----------------------
session_start();
if(!isset($_SESSION['login'])){
    return print_r("Not logged in.");
}
require_once '../model/auth.php';
$conn = (new Auth())->conn;
include_once 'common_functions.php';
//--------------API NAME => METHOD ------------------
return $apis[$_POST['api']]($_POST);

//##################################---------- STUDENT MANAGEMENT ----------------

function get_stud_unassigned_class($post){
  $inst_id = $_SESSION['institute_id'];
  $role_id =$post['role'];
  $stud_ids = array_column(get_where_flds('view_inst_class_user',['user_id'],['institute_id'=>$inst_id,'roll'=>$role_id,'is_active'=>0]),'user_id');
   
  $stud_dets = get_where_in_fk('user_parent',['student_user_id.name','student_user_id.middle_name','student_user_id.last_name','student_user_id.dob','student_user_id.gender','parent_user_id.name','parent_user_id.middle_name','parent_user_id.last_name','student_user_id','profession','relation'],['student_user_id'=>$stud_ids]);

  echo json_encode($stud_dets);die;
}

//---------------------------  GET INSTITUTE CLASS ---------------
function get_class_subject($post){
  $ic_id=$post['ic_id'];
  $stud_ids = get_where_flds('institute_class_subject',['id','institute_class_id','subject_name','optional_sub_set_id'],['institute_class_id'=>$ic_id,'is_active'=>1]);
//  print_r($stud_ids);
  echo json_encode($stud_ids); die;
}

function set_stud_unassigned_class($post){
  $fld_roll=$post['roll'];
  $ic_id=$post['ic_id'];
  $is_active =1;
  $user_fld = json_decode($post['user_id'],true); 
  $subject_fld = json_decode($post['class_sub'],true); 

  foreach ($user_fld as $k => $v) {
    $ic_arr = ['institute_class_id' => $ic_id ,'user_id' => $v ,'roll' => $fld_roll,'is_active' =>$is_active];
   save_table('institute_class_user',time_addins($ic_arr)); 
     foreach ($subject_fld as $ks => $vs) {
        $class_sub__arr = ['subject_id' => $vs ,'user_id' => $v,'is_active' =>$is_active];
        $resultinsert= save_table('institute_class_subject_student',time_addins($class_sub__arr));                   
    }   
}
echo "Shifted successfully with Id : " . $resultinsert;die;  
}



//--------------DAILY ATTENDANCE OVERVIEW ------------------
function daily_att_overview($post){
    $inst_id = $_SESSION['institute_id'];
    $date = $post['date'];
    $res = get_where_in_fk('user_att',['att_status.status','user_id.name','institute_class_id.section','institute_class_id.standard'],['att_date'=>$date,'institute_id'=>$inst_id]);

    $out = [];
    foreach ($res as $k => $v) {
        $out[$v['institute_class_id']]['class_name'] = $v['institute_class_id.standard'].' '.$v['institute_class_id.section'];
        $out[$v['institute_class_id']][$v['att_status.status']][] = $v['user_id.name'];
    }

    $fin[$date] = $out;
    echo print_r($fin);die;
    // echo json_encode($out);die;
}

// STUDNT ASSIGNMENTS CREATION
function insert_assignment($post){
     $asgmt = json_decode($post['assignments'],true);
   //  $doc_url = save_doc($post['doc_assignment']);  // Check and same the document
    $path='';
    if(isset($_FILES['doc_assignment'])){
        $path= save_doc($_FILES['doc_assignment']);
    }  
   // $user_id = $_SESSION['user_id'];
    $teacher_user_id  =  $post['teacher_user_id'];
  //  print_r($teacher_user_id);
    $arr_asgmt = ['teacher_user_id'=>$teacher_user_id,'subject_id'=>$asgmt['subject_id'],'title'=>$asgmt['title'],'date_start'=>$asgmt['date_start'],'date_end'=>$asgmt['date_end'],'content'=>$asgmt['content'],'attachment_url'=>$path,'max_obtain'=>$asgmt['max_obtain'],'min_obtain'=>$asgmt['min_obtain']];
     $asgmt_id=  save_table('assignments',time_addins($arr_asgmt)); 
    $stud_assigned = json_decode($post['students_assigned'],true);
    foreach ($stud_assigned as $k => $v) {      
        $arr_std_asg = ['assignments_id'=>$asgmt_id,'user_id'=>$v['user_id'],'ic_id'=>$v['ic_id']];
        $resultinsert= save_table('assignments_user',time_addins($arr_std_asg));
    }
    if($resultinsert){echo "Assignment Assigned Successfully";}
     else{echo "Error: " . $sql . "<br>" . mysqli_error($conn);}die;   
}

// STUDNT ASSIGNMENTS VIEW FOR STUDENTS
function get_assignment_for_stutent($post){
  //  get subject list by id
    $sub_name =[];
    $data=[];
    $sub_list = get_where_flds('subjects',['id','name'],['is_active'=>1]);
    foreach ($sub_list as $k => $v) {
        $sub_name[$v['id']] = $v['name'];
    }  
    //GET ASSIGNMENT FOR LOGIN USER CHILD
    $stud_user_id =  $_SESSION['stud_user_id'];
    $assign_data = get_where_in_fk('assignments_user',['remark','assignments_id.subject_id','assignments_id.title','assignments_id.date_start','assignments_id.date_end','assignments_id.content','assignments_id.attachment_url'],['user_id'=>$stud_user_id]);
    foreach ($assign_data as $k => $v) {
         $data[] = array( 
            "id"=>$v['assignments_id'],
            "subject"=>$sub_name[$v['assignments_id.subject_id']],
            "title"=> $v['assignments_id.title'],
            "start_date"=> $v['assignments_id.date_start'],
            "end_date"=> $v['assignments_id.date_end'],
            "content"=> $v['assignments_id.content'],
            "url"=>$v['assignments_id.attachment_url'] ,
            "remark"=>$v['remark']         
         );
    }
   echo json_encode($data);die;
}

function get_assig_by_teacher($post){
      //  get subject list by id
      $sub_name =[];
      $assign_lst_data=[];
      $sub_list = get_where_flds('subjects',['id','name'],['is_active'=>1]);
      foreach ($sub_list as $k => $v) {
          $sub_name[$v['id']] = $v['name'];
      }  
      //GET ASSIGNED TEACHER ID
    //  $user_id =  $_SESSION['user_id']; 
       $user_id =  $post['user_id']; 
       // Get Institute class id for login institute..
       $inst_id = $_SESSION['institute_id'];
       $ic_id_arr = get_where_in_flds('institute_class',['id'],['institute_id'=>$inst_id,'is_active'=>1]);
       $ic_ids_arr = array_unique(array_column($ic_id_arr,'id'));
      // Get assignment id for login institute.
       $assign_ids_arr = array_unique(array_column(get_where_in_flds('assignments_user',['assignments_id'],['ic_id'=>$ic_ids_arr,'is_active'=>1]),'assignments_id'));
       if($user_id == '') {
        $assign_lst = get_where_in_flds('assignments',['id','subject_id','title','date_start','date_end','content','attachment_url','max_obtain','min_obtain','added_on'],['id'=>$assign_ids_arr,'is_active'=>1]);  
       } 
       else{
        $assign_lst = get_where_in_flds('assignments',['id','subject_id','title','date_start','date_end','content','attachment_url','max_obtain','min_obtain','added_on'],['teacher_user_id'=>$user_id,'is_active'=>1]);
       }        
       foreach ($assign_lst as $k => $v) {
        $assign_lst_data[] = array( 
           "id"=>$v['id'],
           "subject"=>$sub_name[$v['subject_id']],
           "title"=> $v['title'],
           "start_date"=> $v['date_start'],
           "end_date"=> $v['date_end'],
           "content"=> $v['content'],
           "url"=>$v['attachment_url'] ,    
           "max_obtain"=>$v['max_obtain'],
           "min_obtain"=>$v['min_obtain'],
           "added_on"=>$v['added_on']                     
        );
     }
     echo json_encode($assign_lst_data);die;
}

function get_assign_user($post){
    $assign_id = $post['assign_id'];   // Get assignment_id         
       $assign_data = get_where_in_fk('assignments_user',['id','user_id','ic_id','obtained','remark','assignments_id.id','assignments_id.subject_id','assignments_id.title','assignments_id.date_start','assignments_id.date_end','assignments_id.content','assignments_id.attachment_url'],['assignments_id'=>$assign_id]);
       // Get Student Name by id
       $user_id_arr = array_unique(array_column($assign_data,'user_id'));
       $user_name = get_user_names_by_ids($user_id_arr);
       // Get Class Name by id
       $class_id_arr = array_unique(array_column($assign_data,'ic_id'));
       $class_name = get_class_name_by_id_arr($class_id_arr);
     //  print_r($class_name);
       foreach ($assign_data as $k => $v) {
           $data[] = array( 
              "asg_user_id"=>$v['id'],
              "user_id"=>$v['user_id'],
              "user_name"=>$user_name[$v['user_id']],
              "ic_id"=>$v['ic_id'],
              "ic_name"=>$class_name[$v['ic_id']],
              "obtained"=>$v['obtained'],
              "remark"=>$v['remark'],

              "asg_id"=>$v['assignments_id.id'],
              "subject"=>$v['assignments_id.subject_id'],
              "title"=> $v['assignments_id.title'],
              "start_date"=> $v['assignments_id.date_start'],
              "end_date"=> $v['assignments_id.date_end'],
              "content"=> $v['assignments_id.content'],
              "url"=>$v['assignments_id.attachment_url']                 
           );
      }  
    echo json_encode($data);die;
}

function update_assignments_user($post){
    $assignments_user_data = json_decode($post['update_assignments_user'],true);
    $resul_update= save_table('assignments_user',time_addins($assignments_user_data));
    if($resul_update){echo "Assignment Updated Successfully";}
    else{echo "Error: " . $sql . "<br>" . mysqli_error($conn);}die;   
}


/* Fees Module */

// get fees description
function get_fee($post){
    $fees = json_decode($post['get_fee'],true);
    $ic_id = $fees['ic_id'];
    $academic_year = $fees['academic_year']; 
   // $out =[];
    $out['fic'] = get_where_flds('fee_institute_class',['id','ic_id','fees_name','cycle','cycle_division'],['ic_id'=>$ic_id,'academic_year'=>$academic_year,'is_active'=>1]);     
    // Get Amount from fee_amount table
    $fic_ids_arr = (array_column($out['fic'],'id'));
    $fee_amt = get_where_in_flds('fee_amounts',['id','fic_id','amount'],['fic_id'=>$fic_ids_arr,'is_active'=>1]);
    $fa =[];
    foreach ($fee_amt as $k => $v) { 
      $fa[$v['fic_id']] = ['id'=>$v['id'],'amount'=>$v['amount']];
    }
     $out['fic_amt'] = $fa;

    // Get from fee_fine_setting
    $ffs= get_where_in_flds('fee_fine_setting',['id','fic_id','due_date','days_after','fine_per_day'],['fic_id'=>$fic_ids_arr,'is_active'=>1]);     
    $ffs_arr =[];
    foreach ($ffs as $k => $v) { 
    $ffs_arr[$v['fic_id']] = ['id'=>$v['id'],'due_date'=>$v['due_date'],'days_after'=>$v['days_after'],'fine_per_day'=>$v['fine_per_day']];
    }
    $out['fee_fine_setting'] = $ffs_arr;
       
    echo json_encode($out);die;
}

// This API is use to insert and update in three table fee_institute_class,fee_amounts, fee_fine_setting
function insert_fee_institute_class($post){
    $fee_inst_class = json_decode($post['fee_institute_class'],true);
    $updated_uid = $_SESSION['user']['id'];
    foreach ($fee_inst_class as $k => $v) {
      if(isset($v['id'])){
        $fic_update_arr = ['id'=>$v['id'],'ic_id'=>$v['ic_id'],'fees_name'=>$v['fees_name'],'academic_year'=>$v['academic_year'],'cycle'=>$v['cycle'],'cycle_division'=>$v['cycle_division']];
        $fic_id=  save_table('fee_institute_class',time_addins($fic_update_arr));
        $famt_id = $v['fa_id'];
        $conn = $GLOBALS['conn'];
        // insert into fee_amount table first make is_active = 0 fic_id 
        $conn->query("UPDATE `fee_amounts` SET `is_active` = 0 WHERE `fic_id` = '$fic_id' AND `id`='$famt_id'");
     // for table fee_fine_setting
        $ffs_id =$v['ffs_id'];
        $conn->query("UPDATE `fee_fine_setting` SET `is_active` = 0 WHERE `fic_id` = '$fic_id' AND `id`='$ffs_id'");           
      }
      else{
       // New Entry fee_institute_class
        $fic_update_arr = ['ic_id'=>$v['ic_id'],'fees_name'=>$v['fees_name'],'academic_year'=>$v['academic_year'],'cycle'=>$v['cycle'],'cycle_division'=>$v['cycle_division']];
        $fic_id=  save_table('fee_institute_class',time_addins($fic_update_arr));
      }    
        //  fee_amounts after getting fee_institute_class id
        $fee_amount_arr = ['fic_id'=>$fic_id,'amount'=>$v['amount'],'is_active'=>1,'updated_by'=>$updated_uid];
        $fee_amount2=  save_table('fee_amounts', $fee_amount_arr);
        // fee_fine_setting
        $arr_fee_fine = ['fic_id'=>$fic_id,'due_date'=>$v['due_date'],'days_after'=>$v['days_after'],'fine_per_day'=>$v['fine_per_day'],'is_active'=>1,'updated_by'=>$updated_uid];
        $resultinsert= save_table('fee_fine_setting',$arr_fee_fine); 
     }
  echo "Fees structure inserted successfully.";die;  
}

// Get fee details for student // Used in fee_transaction1.js
function get_fee_details($post){
    $fee_details_student = json_decode($post['fee_details_student'],true);
  //  print_r( $fee_details_student);
    $ic_id = $fee_details_student['ic_id'];
    $user_id = $fee_details_student['user_id'];
    $academic_year = $fee_details_student['academic_year'];    
    $out['fee_inst_class'] = get_where_flds('fee_institute_class',['id','ic_id','academic_year','fees_name','cycle','cycle_division'],['ic_id'=>$ic_id,'academic_year'=>$academic_year,'is_active'=>1]);    
    $out['fee_transaction'] = get_where_in_flds('fee_transaction',['*'],['class_fee_id'=>array_column($out['fee_inst_class'],'id'),'user_id'=>$user_id,'is_active'=>1,'type'=>1]); 
    $out['fin_invoice'] =get_where_in_flds('fin_invoice',['*'],['id'=>array_column($out['fee_transaction'],'invoice_id'),'is_active'=>1]); 
    $out['fee_transaction_return'] = get_where_in_flds('fee_transaction',['*'],['class_fee_id'=>array_column($out['fee_inst_class'],'id'),'user_id'=>$user_id,'is_active'=>1,'type'=>2]);
    $out['fee_transaction_refund'] = get_where_in_flds('fee_transaction',['*'],['class_fee_id'=>array_column($out['fee_inst_class'],'id'),'user_id'=>$user_id,'is_active'=>1,'type'=>3]);
    $out['fee_transaction_all'] = get_where_in_flds('fee_transaction',['*'],['class_fee_id'=>array_column($out['fee_inst_class'],'id'),'user_id'=>$user_id,'is_active'=>1]); 
    $unique_fee_ids = array_column($out['fee_inst_class'],'id');
    // Get Amount from fee_amount table
    $fee_amt = get_where_in_flds('fee_amounts',['id','fic_id','amount'],['fic_id'=>$unique_fee_ids,'is_active'=>1]);
    $fa =[];
    foreach ($fee_amt as $k => $v) { 
      $fa[$v['fic_id']] = $v['amount'];
    }
    $out['fee_amount'] = $fa;
    // End fee_amount       
 
    // Fee Ignorance for the Student
  // Get fee_ignore_user
    $flds_fee_ignore_user = get_where_in_flds('fee_ignore_user',['fic_id','ignore_amount','ignore_cycle_division'],['fic_id'=>$unique_fee_ids,'user_id'=>$user_id,'is_active'=>1]);
    // fee amout to be paid by student after ignorance
     $fai=[];
    foreach ($flds_fee_ignore_user as $k => $v) {
    $fai[$v['fic_id']] = ['ignore_amount'=>$v['ignore_amount'],'ignore_cycle_division'=>$v['ignore_cycle_division']];
    }
    $out['fee_ignore_user'] = $fai; 

    $f_ic=[];
    foreach ($flds_fee_ignore_user as $k => $v) {
    $f_ic[$v['fic_id']] = $v['ignore_cycle_division'];
    }
    $out['fee_ignore_cyc_div'] = $f_ic;



    // Fine to pay with ic_id
        // Get from fee_fine_setting
    $ffs= get_where_in_flds('fee_fine_setting',['id','fic_id','due_date','days_after','fine_per_day'],['fic_id'=>$unique_fee_ids,'is_active'=>1]);     
    $ffs_arr =[];
    foreach ($ffs as $k => $v) { 
      $ffs_arr[$v['fic_id']] = ['id'=>$v['id'],'due_date'=>$v['due_date'],'days_after'=>$v['days_after'],'fine_per_day'=>$v['fine_per_day']];
    }
    $out['fee_fine_setting'] = $ffs_arr;


// student to pay amout per cycle
   $ftp =[];
   foreach ($fee_amt as $k => $v) {
   !isset($fai[$v['fic_id']]) ? $fai[$v['fic_id']]['ignore_amount']=0 : false;  
   $ftp[$v['fic_id']] = $v['amount'] - $fai[$v['fic_id']]['ignore_amount'];
  }
  $out['fee_to_pay'] = $ftp;

 
    // Total fee payed according to fees name
    $t_paid_amt =[];
    foreach($unique_fee_ids as $k1 => $v1){
       $fee_name_type_total =0;
      foreach ($out['fee_transaction'] as $k => $v) {              
          if($v1==$v['class_fee_id']){
            $fee_name_type_total += $v['total_amount'];
          $t_paid_amt[$v['class_fee_id']] = $fee_name_type_total;
        }     
        }
      } 
      $out['fee_by_feename'] =$t_paid_amt;
   
      // Total paid_cycle_amount according to fees name
      $paid_cyc_amt =[];
      foreach($unique_fee_ids as $k1 => $v1){
         $fee_name_type_tot_amt =0;
        foreach ($out['fee_transaction_all'] as $k => $v) {              
            if($v1==$v['class_fee_id']){
              $fee_name_type_tot_amt += $v['paid_cycle_amount'];
            $paid_cyc_amt[$v['class_fee_id']] = $fee_name_type_tot_amt;
          }     
          }
        } 
        $out['paid_cycle_amount'] =$paid_cyc_amt;

/*     $paid_cyc_amt =[];
    foreach($unique_fee_ids as $k1 => $v1){
       $fee_name_type_tot_amt =0;
      foreach ($out['fee_transaction'] as $k => $v) {              
          if($v1==$v['class_fee_id']){
            $fee_name_type_tot_amt += $v['paid_cycle_amount'];
          $paid_cyc_amt[$v['class_fee_id']] = $fee_name_type_tot_amt;
        }     
        }
      } 
      $out['paid_cycle_amount'] =$paid_cyc_amt; */

      // Total fine_paid according to fees name
      $paid_fine_amt =[];
      foreach($unique_fee_ids as $k1 => $v1){
          $fee_name_type_fine_amt =0;
        foreach ($out['fee_transaction_all'] as $k => $v) {              
            if($v1==$v['class_fee_id']){
              $fee_name_type_fine_amt += $v['fine'];
            $paid_fine_amt[$v['class_fee_id']] = $fee_name_type_fine_amt;
          }     
          }
        } 
        $out['paid_fine_amount'] =$paid_fine_amt; 

        
        
    // Total Discount according to fees name
      $discounted_amt =[];
      foreach($unique_fee_ids as $k1 => $v1){
          $fee_name_type_discounted_amt =0;
        foreach ($out['fee_transaction'] as $k => $v) {              
            if($v1==$v['class_fee_id']){
              $fee_name_type_discounted_amt += $v['discout'];
            $discounted_amt[$v['class_fee_id']] = $fee_name_type_discounted_amt;
          }     
          }
        } 
        $out['discounted_amount'] =$discounted_amt; 


 // Total fee return according to fees name
      $return_amt =[];
      foreach($unique_fee_ids as $k1 => $v1){
          $fee_return_type_total =0;
        foreach ($out['fee_transaction_return'] as $k => $v) {              
            if($v1==$v['class_fee_id']){
              $fee_return_type_total += $v['total_amount'];
            $return_amt[$v['class_fee_id']] = $fee_return_type_total;
          }     
          }
        } 
        $out['fee_return_by_feename'] =$return_amt;

         // Total fee refund according to fees name
      $refund_amt =[];
      foreach($unique_fee_ids as $k1 => $v1){
          $fee_refund_type_total =0;
        foreach ($out['fee_transaction_refund'] as $k => $v) {              
            if($v1==$v['class_fee_id']){
              $fee_refund_type_total += $v['total_amount'];
            $refund_amt[$v['class_fee_id']] = $fee_refund_type_total;
          }     
          }
        } 
        $out['fee_refund_by_feename'] =$refund_amt;


   // Calculation for net paid = total paid -(return +refund) ##### $net_paid_amt = $t_paid_amt -($return_amt +$refund_amt;)
/*    $net_paid_amt =[];
   foreach($unique_fee_ids as $k => $v){
    !isset($t_paid_amt[$v]) ? $t_paid_amt[$v]=0 : false;
    !isset($return_amt[$v]) ? $return_amt[$v]=0 : false;
    !isset($refund_amt[$v]) ? $refund_amt[$v]=0 : false;
    $net_paid_amt[$v] = ($t_paid_amt[$v]- ($return_amt[$v] + $refund_amt[$v]));
  }
  // $out['fee_ignore_user'] =$std_fic;
    $out['fee_netpay_by_feename'] =$net_paid_amt; */

    // Net fee Paid till date with fees name excluding Refund amount
     $net_paid_amt =[];
    foreach($unique_fee_ids as $k1 => $v1){
        $fee_net_paid =0;
      foreach ($out['fee_transaction_all'] as $k => $v) {              
          if($v1==$v['class_fee_id']){
            $fee_net_paid += $v['total_amount'];
          $net_paid_amt[$v['class_fee_id']] = $fee_net_paid;
        }     
        }
      } 
      $out['fee_netpay_by_feename'] =$net_paid_amt; 
    echo json_encode($out);die;
}

// Insert fees 
function pay_fees($post){
    $fee_transaction = json_decode($post['fee_transaction'],true);
    $fin_invoice = json_decode($post['fin_invoice'],true);
    $fin_invoice['snapshot'] = $post['fee_transaction'];
    $fin_invoice['institute_id']  = ($_SESSION['institute_id']);
    $result_invoice_id= save_table('fin_invoice',time_addins($fin_invoice));
    foreach ($fee_transaction as $k => $v) { 
       $v['invoice_id'] = $result_invoice_id;
       $fee_transaction_msg=  save_table('fee_transaction',time_addins($v));  
     }
     echo $result_invoice_id;die;  
}

// Insert Income form other sources 
function set_fund_income($post){
  $fin_invoice = json_decode($post['fin_invoice'],true);
  $fin_invoice['snapshot'] = $post['fund_json'];
  $fin_invoice['institute_id']  = ($_SESSION['institute_id']);
  $result_invoice_id= save_table('fin_invoice',time_addins($fin_invoice));
   echo $result_invoice_id;die;  
}

// Get Fee Ignore with students details

function get_fee_ignore_with_students($post){
  $fee_ignore = json_decode($post['get_fee_ignore_with_students'],true);
  $ic_id = $fee_ignore['ic_id'];
  $fic_id = $fee_ignore['fic_id'];
  $role_id = 4 ;// for student 
  // Get all student of the Class (with ic_id)
  $flds = get_where_in_fk('institute_class_user',['user_id','user_id.name','user_id.middle_name','user_id.last_name'],['institute_class_id'=>$ic_id,'is_active'=>1,'roll'=>$role_id]);
  $std= $std_fic=[];
  foreach ($flds as $k => $v) {
    $std[$v['user_id']] = $v['user_id.name'].' '.$v['user_id.middle_name'].' '.$v['user_id.last_name'];
  }
   $out['students'] = $std;
  // Get  Amount from fee_amount table
   $out['amount_percycle'] = get_where_flds('fee_amounts',['amount'],['fic_id'=>$fic_id,'is_active'=>1]);
   // Get fee_ignore_user
  $flds_fee_ignore_user = get_where_in_fk('fee_ignore_user',['user_id','fic_id','ignore_amount','ignore_cycle_division','fic_id.fees_name'],['fic_id'=>$fic_id,'is_active'=>1]);
  foreach ($flds_fee_ignore_user as $k => $v) {
    $std_fic[$v['user_id']] = ['ignore_amount'=>$v['ignore_amount'],'ignore_cycle_division'=>$v['ignore_cycle_division'],'fic_id'=>$v['fic_id'],'fees_name'=>$v['fic_id.fees_name']];
  }
  $out['fee_ignore_user'] =$std_fic;
 echo json_encode($out);die;
}

function set_fee_ignore_user($post){
  $user_id = json_decode($post['user_id'],true);
  $ign_cyc_div = json_decode($post['ignore_cycle_division'],true);
  $fic_id = ($post['fic_id']);
  $ignore_amount = ($post['ignore_amount']);
  //print_r( $ignore_amount);
  $updated_uid = $_SESSION['user']['id'];
  foreach ($user_id as $k => $v) {      
    $arr_fee_ign = ['user_id'=>$v,'fic_id'=> $fic_id,'ignore_amount'=>$ignore_amount,'ignore_cycle_division'=>$ign_cyc_div,'is_active'=>1,'updated_by'=>$updated_uid];
    $resultinsert= save_table('fee_ignore_user',$arr_fee_ign);
}
echo "Fees ignore added successfully with  : " . $resultinsert;die;  
}

// Fee Fine setting starts here

// get fees description
/*   function get_fee_fine($post){
    $fees = json_decode($post['get_fee_fine'],true);
    $ic_id = $fees['ic_id'];
    $academic_year = $fees['academic_year']; 
  // $out =[];
    $out['fic'] = get_where_flds('fee_institute_class',['id','ic_id','fees_name','cycle','cycle_division'],['ic_id'=>$ic_id,'academic_year'=>$academic_year,'is_active'=>1]);     
    // Get Amount from fee_amount table
    $fic_ids_arr = (array_column($out['fic'],'id'));
    $fee_amt = get_where_in_flds('fee_amounts',['id','fic_id','amount'],['fic_id'=>$fic_ids_arr,'is_active'=>1]);
    $fa =[];
    foreach ($fee_amt as $k => $v) { 
      $fa[$v['fic_id']] = ['id'=>$v['id'],'amount'=>$v['amount']];
    }
    $out['fic_amt'] = $fa;

    // Get from fee_fine_setting
     $ffs= get_where_in_flds('fee_fine_setting',['id','fic_id','due_date','days_after','fine_per_day'],['fic_id'=>$fic_ids_arr,'is_active'=>1]);     
     $ffs_arr =[];
     foreach ($ffs as $k => $v) { 
      $ffs_arr[$v['fic_id']] = ['id'=>$v['id'],'due_date'=>$v['due_date'],'days_after'=>$v['days_after'],'fine_per_day'=>$v['fine_per_day']];
    }
     $out['fee_fine_setting'] = $ffs_arr;
    echo json_encode($out);die;
  } */

/* function set_fee_fine($post){
  $fees_fine = json_decode($post['set_fee_fine'],true);
  $updated_uid = $_SESSION['user']['id'];
  foreach ($fees_fine as $k => $v) {
    if($v['id']!=0) {
      $conn = $GLOBALS['conn'];
      $fee_ins_id =$v['fic_id'];
      $ffs_id =$v['id'];
      $conn->query("UPDATE `fee_fine_setting` SET `is_active` = 0 WHERE `fic_id` = '$fee_ins_id' AND `id`='$ffs_id'");      
    }
    $arr_fee_fine = ['fic_id'=>$v['fic_id'],'due_date'=>$v['due_date'],'days_after'=>$v['days_after'],'fine_per_day'=>$v['fine_per_day'],'is_active'=>1,'updated_by'=>$updated_uid];
    $resultinsert= save_table('fee_fine_setting',$arr_fee_fine);
}
echo "Fees fine added/updated successfully with  : " . $resultinsert;die;  
}*/


 function user_fee_details($post){
  $fee_details_student = json_decode($post['fee_details_student'],true);
  //  print_r( $fee_details_student);
    $ic_id = $fee_details_student['ic_id'];
    $user_id = $fee_details_student['user_id'];
    $academic_year = $fee_details_student['academic_year'];   
    $resp= fees_to_be_paid($user_id,$academic_year);
    echo json_encode($resp);die;
} 

function fee_pending_report($post){
  $ic_id = json_decode($post['ic_id'],true);//$_POST['ic_id'];
  $studs   = arr_key_map(get_where_in_fk('institute_class_user',['user_id','roll_no'],['institute_class_id'=>$ic_id,'is_active'=>1,'roll'=>'4']),'user_id');
  $stud_ids   = array_keys($studs);

  $academic_year = ($post['academic_year']); 
  $resp= fees_to_be_paid($stud_ids,$academic_year);
// print_r($resp);
  echo json_encode($resp);die;
}

function fee_overall_rpt($post){
  $inst_id = $_SESSION['institute_id'];
  $ic_id_arr = get_where_in_flds('institute_class',['id','standard','section'],['institute_id'=>$inst_id,'is_active'=>1]);
  $ic_ids_arr = array_unique(array_column($ic_id_arr,'id'));

  $studs   = arr_key_map(get_where_in_fk('institute_class_user',['user_id','roll_no'],['institute_class_id'=>$ic_ids_arr,'is_active'=>1,'roll'=>'4']),'user_id');
  $stud_ids   = array_keys($studs);

  $academic_year = ($post['academic_year']); 
  $resp= fees_to_be_paid($stud_ids,$academic_year);
  $out=[];
  foreach ($ic_id_arr as $k => $v) {
    $out[$v['id']] = $v['standard'].'-'. $v['section'];
  }
  $resp['class']=$out;

// print_r($resp);
  echo json_encode($resp);die;


}

/*############################## STAFF SALARY ###################################### *////*/

function get_staff_details($post){
  $user_id = ($post['user_id']);
  $inst_id = ($_SESSION['institute_id']);
  $is_active = 1;
  $out = [];
      
      $user_roles = get_where_flds('institute_user',['id','roll'],['user_id'=>$user_id,'institute_id'=>$inst_id,'is_active'=>$is_active]);
      $role_arr = (array_column($user_roles,'roll'));
      $roll_name = get_where_in_flds('user_roll',['id','roll'],['id'=>$role_arr,'is_active'=>$is_active]);
      $basic_fld =get_where_flds('user',['*'],['id'=>$user_id,'is_active'=>$is_active]);
      $auth_fld=get_where_flds('user_logins',['email','phone'],['user_id'=>$user_id,'is_active'=>$is_active]);
      $extra_fld['extra_fld'] = get_where_flds('view_extra_fields',['name','value'],['user_id'=>$user_id]);
      $out[] = ['roll'=>$roll_name,'basic_fld'=>$basic_fld,'auth_fld'=>$auth_fld,'extra_fld'=>$extra_fld['extra_fld']];

//    print_r($out);
      echo json_encode($out);die;
}

function set_expenses($post){
  $inst_id = $_SESSION['institute_id']; 
  $expenses = json_decode($post['expense'],true);
  //$details = json_decode($post['details'],true);
  $expenses['institute'] = $inst_id;
  $expenses['details'] = $post['details']; 
  $rst_inv_id= save_table('expense_master',time_addins($expenses));
  echo $rst_inv_id;die;  
}

//##################################---------- SALARY MANAGEMENT ----------------
function get_salary_particular($post){
  $is_active = 1;
  $salary_part_detl =get_where_flds('expense_salary_particular',['id','title'],['is_active'=>$is_active]);
  echo json_encode($salary_part_detl);die;
}

function set_salary_particular($post){
  $sal_part = json_decode($post['salary_particular'],true);
  $updated_uid = $_SESSION['user']['id'];
  foreach ($sal_part as $k => $v) {
    $arr_sal_par = ['title'=>$v['title'],'is_active'=>1,'updated_by'=>$updated_uid];
      $spar_id=  save_table('expense_salary_particular',$arr_sal_par);    
    }
    echo $spar_id;die;  
  }

  function set_expense_staff_pay_scale($post){
    $pay_scale = json_decode($post['staff_pay_scale'],true);
    $institute_id = ($_SESSION['institute_id']);
    $updated_uid = $_SESSION['user']['id'];
    
     foreach ($pay_scale as $k => $v) {
      $v['institute_id']=$institute_id;
      $v['updated_by']=$updated_uid;
      $spar_id=  save_table('expense_staff_pay_scale',$v);   
    }
    echo $spar_id;die;  
  }

  function get_expense_staff_pay_scale($post){ 
   $user_id = ($post['user_id']);
   $inst_id = ($_SESSION['institute_id']);

   $flds = get_where_in_fk('expense_staff_pay_scale',['id','particular_id','particular_id.title','amount','type'],['institute_id'=>$inst_id,'staff_id'=>$user_id,'is_active'=>1]);
   //print_r($flds);
    echo json_encode($flds);die;
  }

  function get_all_staff_pay_scale($post){
    $fld_roll=($post['role_not_in']);
    $inst_id = ($_SESSION['institute_id']);
    $institute_id = ($_SESSION['institute_id']);
    $is_active = 1;
    $conn = $GLOBALS['conn'];

    $result = $conn->query("SELECT `user_id`,`roll` FROM `institute_user` WHERE `roll` NOT IN($fld_roll) AND `institute_id`='$institute_id' AND `is_active`='$is_active'");       

    $staff  = [];
     while($v = mysqli_fetch_assoc($result)){
        $roll_name = get_where_flds('user_roll',['id','roll'],['id'=>$v['roll'],'is_active'=>$is_active]);
        foreach ($roll_name as $k1 => $v1) { $staff[$v['user_id']]['roll']=$v1['roll']; }

        $auth_fld=get_where_in_fk('user_logins',['user_id.name','user_id.middle_name','user_id.last_name','user_id.dob','user_id.gender','user_id.middle_name','user_id.last_name','user_id.current_address','user_id.image_url','email','phone'],['user_id'=>$v['user_id'],'is_active'=>$is_active]);
        foreach ($auth_fld as $k1 => $v1) {
          $staff[$v['user_id']]['full_name']=$v1['user_id.name'].' '.$v1['user_id.middle_name'].' '.$v1['user_id.last_name']; 
          $staff[$v['user_id']]['dob']=$v1['user_id.dob'];
          $staff[$v['user_id']]['gender']=$v1['user_id.gender'];
          $staff[$v['user_id']]['current_address']=$v1['user_id.current_address']; 
          $staff[$v['user_id']]['image_url']=$v1['user_id.image_url']; 
         
          !isset($staff[$v['user_id']]['email']) ? $staff[$v['user_id']]['email']= $v1['email'] : FALSE;
          !isset($staff[$v['user_id']]['phone']) ? $staff[$v['user_id']]['phone'] = $v1['phone'] : FALSE;
        }

/*         $extra_fld['extra_fld'] = get_where_flds('view_extra_fields',['name','value'],['user_id'=>$v['user_id']]);
        foreach ($extra_fld['extra_fld'] as $k1 => $v1) {
          !isset($staff[$v['user_id']]['name']) ? $staff[$v['user_id']]['name'] = $v1['name'] : FALSE;
          !isset($staff[$v['user_id']]['value']) ? $staff[$v['user_id']]['value'] = $v1['value'] : FALSE;
        } */

        $pay_scale =get_where_in_fk('expense_staff_pay_scale',['id','particular_id','particular_id.title','amount','type'],['institute_id'=>$inst_id,'staff_id'=>$v['user_id'],'is_active'=>1]);
        
         //--------INITIALIZE ---------
         $staff[$v['user_id']]['total_pay']['earning'] = 0;
         $staff[$v['user_id']]['total_pay']['deduction'] = 0;

        foreach ($pay_scale as $k1 => $v1) {
         if(isset($v1['id'])){
          !isset($staff[$v['user_id']]['pay_scale'][$v1['id']]['title']) ? $staff[$v['user_id']]['pay_scale'][$v1['id']]['title'] = $v1['particular_id.title'] : FALSE;
          !isset($staff[$v['user_id']]['pay_scale'][$v1['id']]['amount']) ? $staff[$v['user_id']]['pay_scale'][$v1['id']]['amount'] = $v1['amount'] : FALSE;
          !isset($staff[$v['user_id']]['pay_scale'][$v1['id']]['type']) ? $staff[$v['user_id']]['pay_scale'][$v1['id']]['type'] = $v1['type'] : FALSE;
          (($v1['type']) == 1) ?  $staff[$v['user_id']]['total_pay']['earning'] += $v1['amount']: FALSE;
          (($v1['type']) == 2) ?  $staff[$v['user_id']]['total_pay']['deduction'] += $v1['amount']: FALSE;
         }         
        }

    }
  //  print_r($staff);
   echo json_encode($staff);die;

  }

//##################################---------- SETTING EXTRA FIELDS ----------------

function get_all_extra_fields(){
  $institute_id = ($_SESSION['institute_id']);
   $ext_fld_detl = get_where_in_fk('institute_extra_field',['extra_filed_id.name','user_roll.roll'],['institute_id'=>$institute_id,'is_active'=>1]);
   echo json_encode($ext_fld_detl);die;
}