function showDateH() {

      var d = new Date();
      var y = d.getFullYear();
      var month = new Array();
      month[0] = "January";
      month[1] = "February";
      month[2] = "March";
      month[3] = "April";
      month[4] = "May";
      month[5] = "June";
      month[6] = "July";
      month[7] = "August";
      month[8] = "September";
      month[9] = "October";
      month[10] = "November";
      month[11] = "December";
      var m = month[d.getMonth()];
      $("#s_month").html(m);
      $("#s_year").html(y);
}
