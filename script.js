/***************************************************************************************************
 * Listen for the document to load and initialize the application
 */
$(document).ready(initializeApp)

/***************************************************************************************************
 * student_array - global array to hold student objects
 * @type: {Array}
 */
let student_array = []

/***************************************************************************************************
 * initializeApp
 * @param: {undefined} none
 * @returns: {undefined} none
 * initializes the application, including adding click handlers and pulling in any data from the server, in later versions
 */
function initializeApp() {
  addClickHandlersToElements()
  recieveServerData()
  clearPopover()
}

/***************************************************************************************************
 * addClickHandlersToElements - Calls methods when buttons are clicked
 * @param: {undefined}
 * @returns: {undefined}
 *
 */
function addClickHandlersToElements() {
  $('.btn-success').on('click', handleAddClicked)
  $('.btn-default').on('click', handleCancelClick)
}

/***************************************************************************************************
 * handleAddClicked - Event Handler when user clicks the add button
 * @param: {object} event  The event object from the click
 * @return: none
 */
function handleAddClicked() {
  addStudent()
}

/***************************************************************************************************
 * handleCancelClick - Event Handler when user clicks the cancel button, should clear out student form
 * @param: {undefined} none
 * @returns: {undefined} none
 * @calls: clearAddStudentFormInputs
 */
function handleCancelClick() {
  clearAddStudentFormInputs()
}

/***************************************************************************************************
 * addStudent - creates a student objects based on input fields in the form and checks if they pass certian tests then calls other functions.
 * @param: {object} studentObj
 * @return: undefined
 * @calls clearAddStudentFormInputs, updateStudentList, addStudentCall
 */
function addStudent() {
  var studentName = $('#studentName').val()
  var course = $('#course').val()
  var studentGrade = $('#studentGrade').val()
  var student = {
    name: studentName,
    course_name: course,
    grade: studentGrade
  }
  var nameValid = null
  var courseValid = null
  var gradeValid = null

  if (studentName.length < 2 || studentName === '') {
    $('.student-icon').popover('show')
    nameValid = false
  } else {
    $('.student-icon').popover('hide')
    nameValid = true
  }

  if (course.length < 2 || course === '') {
    $('.course-icon').popover('show')
    courseValid = false
  } else {
    $('.course-icon').popover('hide')
    courseValid = true
  }

  if (isNaN(studentGrade) || studentGrade === '' || studentGrade > 115) {
    $('.grade-icon').popover('show')
    gradeValid = false
  } else {
    $('.grade-icon').popover('hide')
    gradeValid = true
  }

  if (nameValid && courseValid && gradeValid) {
    student_array.push(student)
    updateStudentList(student_array)
    clearAddStudentFormInputs()
    addStudentCall(student)
  }
}

/***************************************************************************************************
 * updateStudentCheck - checks if the updated fields pass the same tests as adding a new student then calls a function.
 * @param: {object} studentObj
 * @return: undefined
 * @calls updateStudent
 */
function updateStudentCheck(studentObj) {
  $('.update-student').off()
  $('.new-student-icon').popover('hide')
  $('.new-course-icon').popover('hide')
  $('.new-grade-icon').popover('hide')
  $('.update-student').click(() => {
    var newStudentName = $('.new-name').val()
    var newCourse = $('.new-course').val()
    var newStudentGrade = $('.new-grade').val()

    var newNameValid = null
    var newCourseValid = null
    var newGradeValid = null

    if (newStudentName.length < 2 || newStudentName === '') {
      $('.new-student-icon').popover('show')
      newNameValid = false
    } else {
      $('.new-student-icon').popover('hide')
      newNameValid = true
    }

    if (newCourse.length < 2 || newCourse === '') {
      $('.new-course-icon').popover('show')
      newCourseValid = false
    } else {
      $('.new-course-icon').popover('hide')
      newCourseValid = true
    }

    if (
      isNaN(newStudentGrade) ||
      newStudentGrade === '' ||
      newStudentGrade > 115
    ) {
      $('.new-grade-icon').popover('show')
      newGradeValid = false
    } else {
      $('.new-grade-icon').popover('hide')
      newGradeValid = true
    }

    if (newNameValid && newCourseValid && newGradeValid) {
      updateStudent(studentObj)
      $('#updateModal').modal('hide')
    }
  })
}

/***************************************************************************************************
 * addStudentCall - function that runs the AJAX call to the server to add the new student to the database.
 * @param: {object} student
 */
function addStudentCall(student) {
  $.ajax({
    dataType: 'json',
    data: {
      name: student.name,
      course_name: student.course_name,
      grade: Number(student.grade)
    },
    method: 'POST',
    url: 'https://sgt-back.herokuapp.com/students/add',
    success: function(response) {
      if (response.success) {
        repopulateServerData()
      }
    },
    error: function(response) {
      console.log(response)
    }
  })
}

/***************************************************************************************************
 * clearPopover - clears out the popover values when input area is focused on
 */
function clearPopover() {
  $('.student-input, .new-name').focus(() =>
    $('.student-icon, .new-student-icon').popover('hide')
  )
  $('.course-input, .new-course').focus(() =>
    $('.course-icon, .new-course-icon').popover('hide')
  )
  $('.grade-input, .new-grade').focus(() =>
    $('.grade-icon, .new-grade-icon').popover('hide')
  )
}

/***************************************************************************************************
 * clearAddStudentFormInputs - clears out the form values based on inputIds variable
 */
function clearAddStudentFormInputs() {
  $('#studentName').val('')
  $('#course').val('')
  $('#studentGrade').val('')
  $('.student-icon').popover('hide')
  $('.course-icon').popover('hide')
  $('.grade-icon').popover('hide')
}

/***************************************************************************************************
 * deleteStudent - Function that deletes the student when confirm button is clicked
 * @param: {studentObj, studentRow} studentObj a single student object with course, name, and grade inside
 */
function deleteStudent(studentObj, studentRow) {
  console.log(studentObj)
  $('.delete-student').off()
  $('.delete-student').click(() => {
    $.ajax({
      dataType: 'json',
      data: {
        student_id: studentObj.student_id
      },
      method: 'POST',
      url: 'https://sgt-back.herokuapp.com/students/delete',
      success: function(response) {
        if (response.success) {
          removeStudent(studentObj)
          studentRow.remove()
          updateStudentGrade(student_array)
        }
      },
      error: function(response) {
        console.log(response)
      }
    })
  })
}

/***************************************************************************************************
 * updateStudent - Function that deletes the student when confirm button is clicked
 * @param: {object} studentObj a single student object with course, name, and grade inside
 */
function updateStudent(studentObj) {
  $.ajax({
    dataType: 'json',
    data: {
      student_id: studentObj.student_id,
      name: $('.new-name').val(),
      course_name: $('.new-course').val(),
      grade: $('.new-grade').val()
    },
    method: 'POST',
    url: 'https://sgt-back.herokuapp.com/students/update',
    success: function(response) {
      if (response.success) {
        repopulateServerData()
      }
    },
    error: function(response) {
      console.log(response)
    }
  })
  // });
}

/***************************************************************************************************
 * updateStudentFields - Removes students from student_array
 * @param: {object} studentObj a single student object with course, name, and grade inside
 * @returns: {undefined} none
 */
function updateStudentFields(studentObj) {
  var index = student_array.indexOf(studentObj)
  student_array.splice(index, 1)
  console.log(studentObj)
}

/***************************************************************************************************
 * renderStudentOnDom - take in a student object, create html elements from the values and then append the elements
 * into the .student_list tbody
 * @param: {object} studentObj a single student object with course, name, and grade inside
 */
function renderStudentOnDom(studentObj) {
  console.log(studentObj)
  var newTable = $('<td>')
  var studentName = $('<td>').text(studentObj.name)
  var course = $('<td>').text(studentObj.course_name)
  var studentGrade = $('<td>').text(Number(studentObj.grade))
  var newTable = $('<td>')
  var newRow = $('<tr>')
  var deleteButton = $('<button>', {
    class: 'btn btn-danger col-md-4 col-sm-5 col-xs-12',
    text: 'Delete',
    on: {
      click: () => {
        $('.student-name-modal').text(studentObj.name)
        $('.student-course-modal').text(studentObj.course_name)
        $('.student-grade-modal').text(studentObj.grade)
        $('#deleteModal').modal('show')
        deleteStudent(studentObj, newRow)
      }
    }
  })
  var updateButton = $('<button>', {
    class: 'btn btn-primary col-md-4 col-sm-5 col-xs-12 update-button',
    text: 'Update',
    on: {
      click: () => {
        $('.new-name').val(studentObj.name)
        $('.new-course').val(studentObj.course_name)
        $('.new-grade').val(studentObj.grade)
        $('#updateModal').modal('show')
        updateStudentCheck(studentObj)
      }
    }
  })
  newTable.append(updateButton, deleteButton)
  newRow.append(studentName, course, studentGrade, newTable)
  $('.student-list tbody').prepend(newRow)
}

/***************************************************************************************************
 * updateStudentList - centralized function to update the average and call student list update
 * @param: {array} array of student objects
 * @returns: {undefined} none
 * @calls renderStudentOnDom, calculateGradeAverage, renderGradeAverage
 */
function updateStudentList(array) {
  renderStudentOnDom(array[array.length - 1])
  var calculatedAvg = calculateGradeAverage(array)
  renderGradeAverage(calculatedAvg)
}

/***************************************************************************************************
 * updateStudentGrade - function to update the average grade
 * @param: {array} array of student objects
 * @returns: {undefined} none
 * @calls calculateGradeAverage, renderGradeAverage
 */
function updateStudentGrade(array) {
  var calculatedAvg = calculateGradeAverage(array)
  renderGradeAverage(calculatedAvg)
}

/***************************************************************************************************
 * calculateGradeAverage - loop through the global student array and calculate average grade and return that value
 * @param: {array} grade_array of student objects
 * @returns: {number}
 */
function calculateGradeAverage(grade_array) {
  var total = 0
  for (var i = 0; i < grade_array.length; i++) {
    var result = parseFloat(grade_array[i].grade)
    total += result
  }
  return (total = parseFloat(total / grade_array.length).toFixed(2))
}

/***************************************************************************************************
 * renderGradeAverage - updates the on-page grade average
 * @param: {number} average the grade average
 * @returns: {undefined} none
 */
function renderGradeAverage(average) {
  $('.avgGrade').text(average)
}

/***************************************************************************************************
 * removeStudent - Removes students from student_array
 * @param: {object} studentObj a single student object with course, name, and grade inside
 * @returns: {undefined} none
 */
function removeStudent(studentObj) {
  var index = student_array.indexOf(studentObj)
  student_array.splice(index, 1)
}

/***************************************************************************************************
 * recieveServerData - Pulls student data from the server
 * @param: {object} studentObj a single student object with course, name, and grade inside
 * @returns: {undefined} none
 */
function recieveServerData() {
  $.ajax({
    dataType: 'json',
    method: 'GET',
    url: 'https://sgt-back.herokuapp.com/students',
    success: function(result) {
      if (result.success) {
        for (var i = 0; i < result.data.rows.length; i++) {
          student_array.push(result.data.rows[i])
          updateStudentList(student_array)
        }
      }
    },
    error: function(response) {
      console.log(response)
    }
  })
}

/***************************************************************************************************
 * repopulateServerData - emptys table and student_array then pulls student data from the server
 * @param: {object} studentObj a single student object with course, name, and grade inside
 * @returns: {undefined} none
 */
function repopulateServerData() {
  $('.student-list tbody').empty()
  student_array = []
  $.ajax({
    dataType: 'json',
    method: 'GET',
    url: 'https://sgt-back.herokuapp.com/students',
    success: function(result) {
      console.log(result)
      if (result.success) {
        for (var i = 0; i < result.data.rows.length; i++) {
          student_array.push(result.data.rows[i])
          updateStudentList(student_array)
        }
      }
    },
    error: function(response) {
      console.log(response)
    }
  })
}
