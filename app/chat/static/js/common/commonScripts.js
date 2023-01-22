
var baseUrl = "http://localhost:5000/api/v1"

$(document).ready(function () {

  // localStorage.setItem('organizationId', 1)

  Object.defineProperty(String.prototype, "toHTMLEntitiy", {
    value: function toHTMLEntitiy() {
      return $("<div>").text(this).html();
    },
    writable: true,
    configurable: true
  });

  initAjaxSetUp()

});


var formSubmit = false;
var emailExpr = /^([\w-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([\w-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
var mobileExpr = /\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})/;
var passwordExpr = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,20}$/;
var acceptsOnlyAlphabetsExpr = /^[a-zA-Z]+$/;
var acceptsOnlynumbersExpr = /^[0-9]+$/;
var acceptsOnlyAlphabetsandNumExpr = /^[a-zA-Z0-9]+$/;
var acceptsOnlyAlphabetsSpaceDotExpr = /^[a-zA-Z. ]*$/;
var acceptsAlphaNumricWithSpace = /^(?=.*[A-Za-z0-9])[A-Za-z0-9 _]*$/;
var aadharRegularExpr = /^\d{4}\s\d{4}\s\d{4}$/;
var zipcodeExpr = /^[0-9]{6}$/;
var onlyaphaspace = /^(?=.*[A-Za-z])[a-zA-Z\s]+$/;
var orgID = /^[A-Za-z\d]{4,6}$/;
var floatNumbers = /^[+-]?\d+(\.\d+)?$/;
var addressfields = /^[a-zA-Z0-9!@#$&()-/'`.+, _/\"]*$/;

// var urlExpr = /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z_-]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_-]+=\w+(&[a-zA-Z0-9_-]+=\w+)*)?$/
var urlExpr = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/
var fbUrlCheck = /^(https?:\/\/)?(www\.)?facebook.com\/[a-zA-Z0-9(\.\?)?]/;


$(document).on("change paste keyup", ".mandatoryLocal, .validateLocal, .placeholderred", function () {
  checkValidForm($(this));
});
$(document).on("change paste keyup keypress keydown", ".noKeyPress", function () {
  return false;
});
$(document).on("change paste keyup keypress keydown", ".numbersOnly", function () {
  // Backspace, tab, enter, end, home, left, right
  // We don't support the del key in Opera because del == . == 46.
  var controlKeys = [8, 9, 13, 35, 36, 37, 39];
  // IE doesn't support indexOf
  var isControlKey = controlKeys.join(",").match(new RegExp(event.which));
  // Some browsers just don't raise events for control keys. Easy.
  // e.g. Safari backspace.
  if (!event.which || // Control keys in most browsers. e.g. Firefox tab is 0
    (48 <= event.which && event.which <= 57) || (96 <= event.which && event.which <= 105) ||// Always 1 through 9
    (190 == event.which || 110 == event.which) || (46 == event.which && !($(this).val().includes("."))) || // to allow dot
    isControlKey) { // Opera assigns values for control keys.
    return;
  } else {
    event.preventDefault();
  }
});

function checkViewMode(formEle, forView) {

  if (forView) {
    $(formEle).addClass('viewOnly')

    $(formEle + ' input').each(function () {
      if ($(this).val() == '' && $(this).attr('type') != 'file') {
        $(this).val('-')
      }
    });
    $(formEle + ' textarea').each(function () {
      if ($(this).val() == '') {
        $(this).val('-')
      }
    });
    $(formEle + ' select').each(function () {
      if ($(this).val() == '') {
        $(this).closest('.select-wrapper').find('input.select-dropdown').val('-')
      }
    });
  } else {
    $(formEle).removeClass('viewOnly')
  }

}

function removeViewMode(formEle) {

  $(formEle).removeClass('viewOnly')

  $(formEle + ' input').each(function () {
    if ($(this).val() == '-') {
      $(this).val('')
    }
  });
  $(formEle + ' textarea').each(function () {
    if ($(this).val() == '-') {
      $(this).val('')
    }
  });
  $(formEle + ' select').each(function () {
    if ($(this).val() == '') {
      $(this).val($(this).find("option:first").text())
    }
  });

}


//Check form field is valid or not
function checkValidForm($this) {

  var parentConatiner = $($this).parent();

  if ($($this).data('parent-container') != undefined) {
    parentConatiner = $($this).parents($($this).data('parent-container'));
  }

  if (!formSubmit) {
    // removeError($this, parentConatiner);
    return true;
  }
  var validField = false;

  if ($($this).data('type') == "email") {
    validField = !emailExpr.test($($this).val())
  }
  if ($($this).data('type') == "mobile") {
    validField = !mobileExpr.test($($this).val())
  }
  if ($($this).data('type') == "password") {
    validField = !passwordExpr.test($($this).val())
  }
  if ($($this).data('type') == "onlyalpha") {
    validField = !acceptsOnlyAlphabetsExpr.test($($this).val())
  }
  if ($($this).data('type') == "onlyalphaandnum") {
    validField = !acceptsOnlyAlphabetsandNumExpr.test($($this).val())
  }
  if ($($this).data('type') == "onlynum") {
    validField = !acceptsOnlynumbersExpr.test($($this).val())
  }
  if ($($this).data('type') == "onlyfloatnum") {
    validField = !floatNumbers.test($($this).val())
    if (!validField && !isInvalidString($($this).data('maxvalue')))
      validField = parseFloat($($this).val()) > parseFloat($($this).data('maxvalue'))
  }
  if ($($this).data('type') == "aadhar") {
    validField = !aadharRegularExpr.test($($this).val())
    if (!validField) {
      validField = $($this).val() == "0000 0000 0000";
    }
  }
  if ($($this).data('type') == "zipcode") {
    validField = !zipcodeExpr.test($($this).val())
    if (!validField) {
      validField = $($this).val() == "000000";
    }
  }
  if ($($this).data('type') == "url") {
    validField = !urlExpr.test($($this).val())
  }
  if ($($this).data('type') == "onlyaphaspace") {
    validField = !onlyaphaspace.test($($this).val())
  }
  if ($($this).data('type') == "alphanumwithspace") {
    validField = !acceptsAlphaNumricWithSpace.test($($this).val())
  }
  if ($($this).data('type') == "alphwithspacedot") {
    validField = !acceptsOnlyAlphabetsSpaceDotExpr.test($($this).val())
  }
  if ($($this).data('type') == "fburl") {
    validField = !fbUrlCheck.test($($this).val())
  }
  if ($($this).data('type') == "orgid") {
    validField = !orgID.test($($this).val())
  }
  if ($($this).data('type') == "notacceptzero") {
    validField = (parseInt($($this).val()) <= 0);
  }
  if ($($this).data('type') == "percentage") {
    validField = (parseInt($($this).val()) < 0 || parseInt($($this).val()) > 100);
  }
  if ($($this).data('type') == "checkempty") {
    validField = ($($this).val().trim() == "");
  }
  if ($($this).data('type') == "confirm-password") {
    validField = $($this).val() != $($($this).data('new-password')).val();
  }
  if ($($this).data('type') == "addressfields") {
    validField = !addressfields.test($($this).val())
  }

  if ($($this).hasClass('validateLocal') && $($this).val() === '') {
    removeError($this, parentConatiner);
    return true;
  }

  if (validField || $($this).val() == null || $($this).val() === '' || $($this).val().length == 0 || $($this).val() === 'select') {
    $($this).addClass('placeholderred');
    $($this).siblings().find('button').addClass('placeholderred');

    if ($($this).data('type') == "password" || $($this).data('label') == undefined) {
     /* return false;*/
    }


    var errorMessage = "";

    errorMessage += $($this).data('label');

    if ($($this).val() == null || $($this).val() === '' || $($this).val().length == 0 || $($this).val() === 'select') {
      errorMessage += " required";
      
    } else {
      errorMessage = "Please enter valid " + errorMessage;
    }
  
    if ($($this).data('type') == "confirm-password") {
      errorMessage = "Password and Confirm Password should be match"
    }

    if (parentConatiner.find('.error_msg').html() != undefined) {
      if (parentConatiner.hasClass('input-group'))
        parentConatiner.parent().find('.error_msg').text(errorMessage);
      else
        parentConatiner.find('.error_msg').text(errorMessage);
    } else {
      if (parentConatiner.hasClass('input-group')) {
        parentConatiner.parent().find('small').remove();
        parentConatiner.parent().append("<small class='error_msg'>" + errorMessage + "</small>")
      } else
        parentConatiner.append("<small class='error_msg'>" + errorMessage + "</small>")
    }
    return false;
  } else {
    removeError($this, parentConatiner);
    return true;
  }
}
//Validate Given Form
function validateForm(formEle) {

  formSubmit = true;

  var isValidForm = true;
  var errorElement = null;

  $(formEle + ' .mandatoryLocal:visible, ' + formEle + ' .validateLocal:visible, ' + formEle + ' select.mandatoryLocal:visible').each(function () {
    if (!checkValidForm($(this))) {
      if (errorElement == null) {
        errorElement = $(this)
      }
      isValidForm = false;
    }
  })

  if (isValidForm) {
    // Valid Data Prepare Payload
  } else {
    $('html, body').animate({
      scrollTop: (errorElement.offset().top - 50)
    }, 500);
  }

  return isValidForm
}
function resetForm(formEle) {

  $(formEle).trigger("reset");
  // $(formEle + ' .multiselect-native-select select').multiselect("clearSelection").multiselect('refresh');
  $(formEle + ' .placeholderred').removeClass('placeholderred')
  $(formEle + ' .error_msg').remove()

}


function removeError($this, parentConatiner) {

  $($this).removeClass('placeholderred');
  $($this).siblings().find('button').removeClass('placeholderred');

  if (parentConatiner.hasClass('input-group') && parentConatiner.parent().find('.error_msg').html() != undefined)
    parentConatiner.parent().find('.error_msg').remove();
  else if (parentConatiner.find('.error_msg').html() != undefined) {
    parentConatiner.find('.error_msg').remove();
  }

  if (parentConatiner.hasClass('input-group') && parentConatiner.parent().find('.error_msg').html() != undefined)
    parentConatiner.parent().find('.error_msg').remove();
  else if (parentConatiner.find('.error_msg').html() != undefined) {
    parentConatiner.find('.error_msg').remove();
  }

}
/**********************************************
*   Form Field Validations END
*********************************************/

/**********************************************
*       API Related Functions Starting
*********************************************/
function initAjaxSetUp() {
  $.ajaxSetup({
    headers: {
      'deviceType': "WEB"
    },
    beforeSend: function (xhr) {
      if (!isInvalidString(localStorage.getItem("sessiontoken"))) {
        xhr.setRequestHeader('sessiontoken', localStorage.getItem("sessiontoken"));
      }
      
    }
  });
}
$(document).ajaxStart(function () {
  $('.loaderDiv').removeClass('d-none')
});
$(document).ajaxComplete(function () {
  $('.loaderDiv').addClass('d-none')
});

// AJAX API CALL ERROR HANDLING
function errorCallBack(data, textStatus, jqXHR) {
  if (data.status === 401) {
    clearUserSession();
    window.location.href = "login";
  } else {
    if (!isInvalidString(data.responseJSON) && !isInvalidString(data.responseJSON.message))
      show_StatusModal(data.responseJSON.message, statusEnum.error)
    else
      show_StatusModal("A System Error occurred. Please try again.", statusEnum.error)
  }
}

function errorHandledCallBack(data, textStatus, jqXHR, errorHandledCallBack) {
  errorCallBack(data, textStatus, jqXHR)
  errorHandledCallBack()
}



/**********************************************
*       User Session Related Functions Starting
*********************************************/
function clearUserSession() {
  localStorage.removeItem('sessiontoken')
  localStorage.removeItem('userDetails')

  setCookie('sessiontoken', '', 0);

}

function addUserSession(user) {
  localStorage.setItem('sessiontoken', user.sessiontoken)
  localStorage.setItem('userDetails', JSON.stringify(user))

  setCookie('sessiontoken', user.sessiontoken, 30);
}


function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires=" + d.toUTCString();
  if (location.protocol === 'https:' || location.hostname === "localhost" || location.hostname === "127.0.0.1") { 
    // SameSite=None; Secure -- will not set for http urls
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; SameSite=None; Secure";
  } else {
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/; ";
  }
}
/**********************************************
*       User Session Related Functions Ending
*********************************************/

/**********************************************
* String Empty or not Checking & focus & gotoBackPage
*********************************************/
function isInvalidString(str) {
  //    str = $.trim(str);
  if (str === '' || str == '' || str === null || str == null ||
    typeof str === 'undefined' || str == undefined) {
    return true;
  }
  return false;
}

function getValidData_toDisplay(str) {
  if (isInvalidString(str)) {
    return '-';
  }
  return str;
}

function validateTextField(ele) {
  if ($(ele).val().trim() === "") {
    $(ele).val('').addClass('placeholderred');
    if (isValid) {
      $(ele).focus();
    }
    isValid = false;
    return false;
  }
  return true;
}

function goToPreviousPage() {
  history.back();
}

  

//Retrieves the URL parameter
function GetURLParameter(sParam) {
 var sPageURL = window.location.search.substring(1);
 var sURLVariables = sPageURL.split('&');
 for (var i = 0; i < sURLVariables.length; i++) {
     var sParameterName = sURLVariables[i].split('=');
     if (sParameterName[0] == sParam) {
         return decodeURIComponent(sParameterName[1]);
     }
 }
}