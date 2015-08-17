window.onload = function() {
  console.log('file loaded');
  var calendar = new Calendar();
};


var Calendar = function() {
  this.currentDate = new Date();
  this.day = this.currentDate.getDay(); // 0-6 
  this.month = this.currentDate.getMonth(); // will return 0-11
  this.year = this.currentDate.getFullYear();
  this.shortDayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  this.fullDayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  this.fullMonthNames = ['January', 'Februrary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Decemeber'];
  this.updateDate();
  this.renderCalendar();
}

Calendar.prototype.updateDate = function() {
  this.date = new Date(this.year, this.month, 1);
  this.day = this.date.getDay();
  this.month = this.date.getMonth();
  this.year = this.date.getFullYear();
  this.firstDayOfMonth = new Date(this.year, this.month, 1).toString().split(' ')[0];
  this.numberOfDays = new Date(this.year, this.month + 1, 0).getDate();
  this.monthStartColumn = this.shortDayNames.indexOf(this.firstDayOfMonth);
};

Calendar.prototype.renderCalendar = function() {
  //create the day side view
  var dayName = document.getElementById('full-day-name');
  var dayNumber = document.getElementById('large-day-number');
  dayName.innerHTML = this.fullDayNames[this.currentDate.getDay()];
  dayNumber.innerHTML = this.currentDate.getDate();

  //clear and grab the table
  this.clearCalendar();
  var table = document.getElementById('calendar-table');

  //create the table header
  var tableHeader = document.createElement('tr');
  tableHeader.innerHTML = '<tr><th id="previous"><</th><th id="month" colspan="5">' +
                          [this.fullMonthNames[this.month], this.year].join(' ') +
                          '</th><th id="next">></th></tr>';
  table.appendChild(tableHeader);

  //add click events to the month controls
  var goToPrevious = document.getElementById('previous');
  var goToNextMonth = document.getElementById('next');
  goToPrevious.addEventListener('click', this.previousMonth.bind(this));
  goToNextMonth.addEventListener('click', this.nextMonth.bind(this));

  //Create a row for the letters representing the days of the week
  var dayLetterRow = document.createElement('tr');
  for (var i = 0; i <= 6; i++) {
    var rowData = document.createElement('td');
    rowData.innerHTML = this.shortDayNames[i].substring(0, 1);
    rowData.className = 'day-row';
    dayLetterRow.appendChild(rowData);
  };
  table.appendChild(dayLetterRow);

  //create the first row of days with the starting date
  var row; //created outside of the loop to keep track of blank space in the first row
  var startingRow = document.createElement('tr');
  for (var row = 0; row <= 6; row++) {
    if (row == this.monthStartColumn) {
      break;
    };
    var rowData = document.createElement('td');
    rowData.innerHTML = '';
    startingRow.appendChild(rowData);
  };
  var dayCount = 1; //Months start at 1
  for (var row; row <= 6; row++) {
    var rowData = document.createElement('td');
    rowData.className = 'day';
    rowData.innerHTML = dayCount;
    dayCount++;
    startingRow.appendChild(rowData);
  }
  table.appendChild(startingRow);

  //first for loop making a new row starting at the 3rd row second finishes the rows with numbers
  for (var row = 3; row <= 7; row++) {
    var tableRow = document.createElement('tr');
    for (var i = 0; i <= 6; i++) {
      if (dayCount > this.numberOfDays) {
        break;
      };
      var rowData = document.createElement('td');
      rowData.className = 'day';
      rowData.innerHTML = dayCount;
      if (this.currentDate.getDate() == dayCount && this.date.getMonth() == this.currentDate.getMonth() && this.date.getFullYear() == this.currentDate.getFullYear()) {
        rowData.setAttribute('name', 'selected');
      };
      dayCount++;
      tableRow.appendChild(rowData);
    }
    table.appendChild(tableRow);
  };

  //add click and keyboard event to the days to change the day number and name in the day view decalre this to have this persist as the calendar 
  var dates = document.getElementsByClassName('day');
  var thisCalendar = this;
  for (var i = 0; i < dates.length; i++) {
    dates[i].addEventListener('click', function() {
      if (document.getElementById('clicked') != undefined){
        var clicked = document.getElementById('clicked');
        clicked.setAttribute('id', '');
      }
      dayNumber.innerHTML = this.innerHTML;
      var index = thisCalendar.findIndex(this);
      this.setAttribute('id', 'clicked');
      dayName.innerHTML = thisCalendar.fullDayNames[index];
    });
  };

  //add the keyboard event
  document.onkeydown = function(e) {
    switch (e.keyCode) {
      case 37:
        thisCalendar.previousMonth();
        break;
      case 39:
        thisCalendar.nextMonth();
        break;
    };
  };
};

//clear calendar to update to new month
Calendar.prototype.clearCalendar = function() {
  var table = document.getElementById('calendar-table');
  while (table.hasChildNodes()) {
    table.removeChild(table.firstChild);
  };
};

//Calendar controls
Calendar.prototype.nextMonth = function() {
  this.clearCalendar();
  if (this.month < 11) {
    this.month += 1;
    this.updateDate();
    this.renderCalendar();
    return this.date;
  }
  this.month = 0;
  this.year += 1;
  this.updateDate();
  this.renderCalendar();
};

Calendar.prototype.previousMonth = function() {
  this.clearCalendar()
  if (this.month <= 0) {
    this.month = 11;
    this.year -= 1;
    this.updateDate();
    this.renderCalendar();
    return this.date;
  }
  this.month -= 1;
  this.updateDate();
  this.renderCalendar();
};


//find the index of the td element to change the day name
Calendar.prototype.findIndex = function(node) {
  var index = 0;
  while (node = node.previousSibling) {
    if (node.nodeType === 1) {
      index++;
    };
  };
  return index;
};