//#region constants
const hostStr = location.protocol + '//' + location.host + '/';
//#endregion
//#region global variables
var newId, directorRoleId;
var employeeArr, roleArr, managerArr = [];
//#endregion

//#region html element event handlers
$(document).ready(
    function () {
        getResetEmployeeArr();
        getResetRoleArr();
        getResetManagerArr();
        
        populateMgrComboBox('#mgrSelector');
    }
);

$('#mgrSelector').on(
    'change', 
    function() {
        repopulateEmployeeTbl(this.value);
    }
);

$('#addEmployeeButton').on(
    'click',
    function() {
        resetForm();
        $('#addEmployeePopup').show();
    }
);

$('#formIdInput').on(
    'keypress',
    function(e) {
        let regex = new RegExp("^[0-9]");
        // Detect charCode of pressed key. If not charCode, then return code for mouse button.
        let key = String.fromCharCode(!e.charCode ? MouseEvent.button : e.charCode);
        if (!regex.test(key)) {
            e.preventDefault();
            return false;
        };
    }
);
$('#formIdInput').on(
    'focusout',
    function() {
        if (this.value < newId) {
            this.value = newId;
        }
    }
);

$('#formFirstNameInput, #formLastNameInput').on(
    'keypress',
    function(e) {
        let regex = new RegExp("^([a-zA-Z]|\'|\-| )");
        // Detect charCode of pressed key. If not charCode, then return code for mouse button.
        let key = String.fromCharCode(!e.charCode ? MouseEvent.button : e.charCode);
        if (!regex.test(key)) {
            e.preventDefault();
            return false;
        }
    }
);

$('#saveEmployeeButton').on(
    'click',
    function() {
        let errorArr = [];
        let warningArr = [];
        let errorIndex = -1;
        //let warningIndex = -1;
        let regExp = new RegExp("[a-zA-Z]");

        errorIndex = errorArr.indexOf('Manager: Not selected.');
        if ($('#formManagerSelector option:selected').val() < 1) {
            $('#formManagerSelector').css('border', '3px solid crimson');
            $('#mgrSelMsgDiv, #mgrNotSelectedError').show();

            if(errorIndex === -1 ) {
                errorArr.push('Manager: Not selected.');
            };
        }
        else {
            $('#formManagerSelector').css('border', 'revert');
            $('#mgrSelMsgDiv, #mgrNotSelectedError').hide();

            if (errorIndex !== -1) {
                errorArr.splice(errorIndex, 1);
            };
        };

        /*warningIndex = warningArr.indexOf('Employee ID: Already Exists.');
        if($.inArray(parseInt($('#formIdInput').val()), employeeTbl.map(a => parseInt(a.EmployeeId))) !== -1) {
            $('#formIdInput').css('border', '3px solid darkgoldenrod');
            $('#formIdMsgDiv, #employeeIdExistsWarning').show();

            if (warningIndex === -1) {
                warningArr.push('Employee ID: Already Exists.');
            };
        }
        else {
            $('#formIdInput').css('border', 'revert');
            $('#formIdMsgDiv, #employeeIdExistsWarning').hide();

            if (warningIndex !== -1) {
                warningArr.splice(warningIndex, 1);
            };
        };*/

        errorIndex = errorArr.indexOf('First Name: Invalid.');
        if(!regExp.test($('#formFirstNameInput').val()) || $('#formFirstNameInput').val() == '') {
            $('#formFirstNameInput').css('border', '3px solid crimson');
            $('#firstNameMsgDiv, #firstNameInvalidError').show();

            if (errorIndex === -1) {
                errorArr.push('First Name: Invalid.');
            };
        }
        else {
            $('#firstNameMsgDiv, #firstNameInvalidError').hide();
            $('#formFirstNameInput').css('border', 'revert');

            if (errorIndex !== -1) {
                errorArr.splice(errorIndex, 1);
            }
        };

        errorIndex = errorArr.indexOf('Last Name: Invalid.');
        if(!regExp.test($('#formLastNameInput').val()) || $('#formLastNameInput').val() == '') {
            $('#formLastNameInput').css('border', '3px solid crimson');
            $('#lastNameMsgDiv, #lastNameInvalidError').show();

            if (errorIndex === -1) {
                errorArr.push('Last Name: Invalid.');
            };
        }
        else {
            $('#lastNameMsgDiv, #lastNameInvalidError').hide();
            $('#formLastNameInput').css('border', 'revert');

            if (errorIndex !== -1) {
                errorArr.splice(errorIndex, 1);
            }
        };

        errorIndex = errorArr.indexOf('Role: Not Selected.');
        if($('#formRolesInput option:selected').length < 1) {
            $('#formRolesInput').css('border', '3px solid crimson');
            $('#roleMsgDiv, #noRoleSelError').show();

            if (errorIndex === -1) {
                errorArr.push('Role: Not Selected.');
            };
        }
        else {
            $('#roleMsgDiv, #noRoleSelError').hide();
            $('#formRolesInput').css('border', 'revert');

            if (errorIndex !== -1) {
                errorArr.splice(errorIndex, 1);
            };
        };

        if (errorArr.length > 0) {
            $('#saveEntryDialog ul').empty();
            errorArr.forEach(err => {
                $('#saveEntryDialog ul').append('<li>' + err + '</li>');
            });
            $('#entryErrorDialogMsg, #entryErrorButtons').show();              
        }
        else if (warningArr.length > 0) {
            $('#saveEntryDialog ul').empty();
            warningArr.forEach(warning => {
                $('#saveEntryDialog ul').append('<li>' + warning + '</li>');
            });
            $('#entryWarningDialogMsg, #saveEntryButtons').show();         
        }
        else {
            $('#saveEntryDialog ul').empty();
            $('#saveEntryDialogMsg, #entryWarningButtons').show(); 
        }
        $('#dialogOverlay').show();
        $('#saveEntryDialog').show();
    }
);

$('#saveConfButton').on(
    'click',
    function() {
        saveNewEmployee();
        $('#saveEntryDialog, #saveEntryDialog div').hide();
        $('#dialogOverlay').hide();
        $('#addEmployeePopup').hide();
    }
);

$('#saveConfCancelButton').on(
    'click',
    function() {
        $('#saveEntryDialog, #saveEntryDialog div').hide();
        $('#dialogOverlay').hide();
    }
);

$('#warningConfButton').on(
    'click',
    function() {
        saveNewEmployee();
        $('#saveEntryDialog, #saveEntryDialog div').hide();
        $('#dialogOverlay').hide();
        $('#addEmployeePopup').hide();
    }
);

/*
$('#warningConfCancelButton').on(
    'click',
    function() {
        $('#saveEntryDialog, #saveEntryDialog div').hide();
        $('#dialogOverlay').hide();
    }
);
*/

$('#errorConfButton').on(
    'click',
    function() {
        $('#saveEntryDialog, #saveEntryDialog div').hide();
        $('#dialogOverlay').hide();
    }
);

$('#cancelEntryButton').on(
    'click',
    function() {
        $('#dialogOverlay').show();
        $('#cancelEntryDialog').show();
    }
);

$('#cancelEntryDialogYes').on(
    'click',
    function() {
        $('#cancelEntryDialog').hide();
        $('#dialogOverlay').hide();
        $('#addEmployeePopup').hide();
    }
);

$('#cancelEntryDialogNo').on(
    'click',
    function() {
        $('#cancelEntryDialog').hide();
        $('#dialogOverlay').hide();
    }
);
//#endregion

function getResetEmployeeArr() {
    $.ajax({
        async: false,
        type: 'GET',
        url: hostStr + 'employee',
        success: function(data) {
            employeeArr = $.csv.toObjects(data);
        },
        error: function(err) {
            console.error(err);
        }
    });
};

function getResetRoleArr() {
    $.ajax({
        async: false,
        type: 'GET',
        url: hostStr + 'role',
        success: function(data) {
            roleArr = $.csv.toObjects(data);
        },
        error: function(err) {
            console.error(err);
        }
    });
    directorRoleId = roleArr.find(a => a.Role === 'Director').RoleId;
};

function getResetManagerArr() {
    managerArr = employeeArr.filter(a => $.inArray(directorRoleId, a.Role.split(';')) !== -1);
}

function populateMgrComboBox(selectElement) {
    $(selectElement).empty();
    $(selectElement).append('<option disabled selected value="0">--Select Manager--</option>')
    managerArr.forEach(mgr => {
        let newOption = document.createElement('option');
        newOption.value = mgr.EmployeeId;
        newOption.innerHTML = mgr.FirstName + ' ' + mgr.LastName;
        $(selectElement).append(newOption);
    });
};

function populateRoleComboBox(selectElement) {
    roleArr.forEach(role => {
        let myOption = document.createElement('option');
        myOption.value = role.RoleId;
        myOption.innerHTML = role.Role;
        $(selectElement).append(myOption);
    });
};

function repopulateEmployeeTbl(managerId) {
    let selEmployeeTbl = employeeArr.filter(a => a.ManagerId == managerId);

    $('#employeeTbl tbody').empty();
    if (selEmployeeTbl.length < 1) {
        $('#employeeTbl tbody').append(`<tr><td colspan="3">(Seems like nobody is here <em>yet</em>...)</td></tr>`);
    }
    else {
        selEmployeeTbl.forEach(employee => {
            $('#employeeTbl tbody').append(`<tr><td>${employee.EmployeeId}</td><td>${employee.LastName}</td><td>${employee.FirstName}</td></tr>`);
        });
    };
};

function resetForm() {
    $('#formManagerSelector').empty();
    //$('#formManagerSelector').append('<option value="0">--Select Manager--</option>');
    populateMgrComboBox('#formManagerSelector');
    $(`#formManagerSelector option[value=${$('#mgrSelector').val()}]`).attr('selected', 'selected');
    $(`#formManagerSelector option[value=0]`).attr('disabled', 'disabled');

    setNewId();
    $('#formIdInput').val(newId);

    $('#formFirstNameInput, #formLastNameInput').val('');

    $('#formRolesInput').empty();
    populateRoleComboBox('#formRolesInput');

    $('.formFieldMsgArea').hide();
    $('#newEmployeeForm select, input').css('border', 'revert');
};

function setNewId() {
    newId = Math.max.apply(null, employeeArr.map(a => parseInt(a.EmployeeId, 10))) + 1;
};

function saveNewEmployee() {
    let roles = [];
    $.each(
        $('#formRolesInput option:selected'),
        function() {
            roles.push($(this).val());
        }
    );

    let newEmployeeObj = {
        EmployeeId: $('#formIdInput').val(),
        LastName: $('#formLastNameInput').val(),
        FirstName: $('#formFirstNameInput').val(),
        Role: roles.join(';'),
        ManagerId: $('#formManagerSelector option:selected').val()
    };

    $.ajax({
        type: 'POST',
        async: false,
        url: hostStr + 'employee',
        contentType: "application/json",
        data: JSON.stringify(newEmployeeObj),
        sucess: function() {},
        error: function() {}
    });

    getResetEmployeeArr();
    if ($.inArray(directorRoleId, newEmployeeObj.Role.split(';')) !== -1) {
        getResetManagerArr();
        populateMgrComboBox('#mgrSelector');
        $(`#mgrSelector option[value=${newEmployeeObj.ManagerId}]`).attr('selected', 'selected');
    };
    repopulateEmployeeTbl($('#mgrSelector option:selected').val());
};