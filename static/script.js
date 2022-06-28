function deleteQr(id) {
    let link = '/del/'.concat(id);
    let form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', link);
    form.style.display = 'hidden';
    document.body.appendChild(form);
    form.submit();
};

const urlFormat = /^(?:(?:https?):\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,}))\.?)(?::\d{2,5})?(?:[/?#]\S*)?$/i;
const mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
const commentMinLength = 10;
const commentMaxLength = 230;
const passMinLength = 8;
const passMaxLength = 24;
let editHistoryFetched = false;
let redirectHistoryFetched = false;
let emailPass = false;
let passwordPass = false;
let passwordConfirmationPass = false;
let confirmationPassInput = false;
let urlPass = false;
let commentPass = false;
let urlEditPass = true;
let commentEditPass = true;
let chartLoaded = false;

function getEditHistory(id) {
    if (!editHistoryFetched) {
        $.ajax({
            url: '/edhist/' + id,
        })
        .done(function(res) {
            // Hide loading animation
            $('#editHistoryLoader').hide();
            // Only display if some history found
            if (res.editHistory) {
                // Append results to list
                res.editHistory.forEach(element => {
                    $('#listEditHistory').append(`
                        <tr>
                            <th scope="row">${element.id}</th>
                            <td>${element.linksto}</td>
                            <td>${element.comment}</td>
                            <td>${element.fromdate}</td>
                            <td>${element.todate}</td>
                        </tr>
                    `);
                });
            } else {
                $('#listEditHistory').append(`
                <tr>
                        <th scope="row">-</th>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                        <td>-</td>
                </tr>
            `);
            }
            editHistoryFetched = true;
        })
        .fail(function(err) {
            console.log('Error: ' + err.status);
        });
    }
};

function getRedirectHistory(id) {
    if (!redirectHistoryFetched) {
        $.ajax({
            url: '/rehist/' + id,
        })
        .done(function(res) {
            // Hide loading animation
            $('#redirectHistoryLoader').hide();
            // Only display if some history found
            if (res.redirectHistory) {
                // Append results to list
                res.redirectHistory.forEach(element => {
                    $('#listRedirectHistory').append(`
                        <tr>
                            <th scope="row">${element.id}</th>
                            <td>${element.viewedat}</td>
                            <td>Not yet implemented</td>
                        </tr>
                    `);
                });
            } else {
                $('#listRedirectData').append(`
                    <tr>
                            <th scope="row">-</th>
                            <td>-</td>
                            <td>-</td>
                    </tr>
                `);
            }
            redirectHistoryFetched = true;
        })
        .fail(function(err) {
            console.log('Error: ' + err.status);
        });
    }
};

function updateEditHistory(id) {
    // Clean list
    $('#listEditHistory').empty();
    // Show loading animation
    $('#editHistoryLoader').show();
    // Set to false
    editHistoryFetched = false;
    // Call for getEditHistory
    getEditHistory(id);
};

function updateRedirectHistory(id) {
    // Clean list
    $('#listRedirectHistory').empty();
    // Show loading animation
    $('#redirectHistoryLoader').show();
    // Set to false
    redirectHistoryFetched = false;
    // Call for getEditHistory
    getRedirectHistory(id);
};

function CheckEqualsPass() {
    let password = $('#floatingPassword').val();
    let confirmation = $('#floatingPasswordConfirm').val();
    if (password === confirmation && confirmation.length >= passMinLength && confirmation.length <= passMaxLength) {
        $('#floatingPasswordConfirm').attr('class', 'form-control is-valid');
        passwordConfirmationPass = true;
    } else {
        $('#floatingPasswordConfirm').attr('class', 'form-control is-invalid');
        passwordConfirmationPass = false;
    }
};

function checkLength() {
    let password = $('#floatingPassword').val();
    if (password.length >= passMinLength && password.length <= passMaxLength) {
        $('#floatingPassword').attr('class', 'form-control is-valid');
        passwordPass = true;
    } else {
        $('#floatingPassword').attr('class', 'form-control is-invalid');
        passwordPass = false;
    }
};

function ValidateEmail() {
    let email = $('#floatingEmail').val();
    if (email.match(mailformat)) {
        $('#floatingEmail').attr('class', 'form-control is-valid');
        emailPass = true;
    } else {
        $('#floatingEmail').attr('class', 'form-control is-invalid');
        emailPass = false;
    }
};

function ValidateUrl() {
    let url = $('#urlInput').val();
    if (url.match(urlFormat)) {
        $('#urlInput').attr('class', 'form-control is-valid');
        urlPass = true;
    } else {
        $('#urlInput').attr('class', 'form-control is-invalid');
        urlPass = false;
    }
};

function validateComment() {
    let comment = $('#commentInput').val();
    if (comment.length >= commentMinLength && comment.length <= commentMaxLength) {
        $('#commentInput').attr('class', 'form-control is-valid');
        commentPass = true;
    } else {
        $('#commentInput').attr('class', 'form-control is-invalid');
        commentPass = false;
    }
};

function ValidateUrlEdit() {
    let url = $('#urlEditInput').val();
    if (url.match(urlFormat) || (url.length === 0)) {
        $('#urlEditInput').attr('class', 'form-control is-valid');
        urlEditPass = true;
    } else {
        $('#urlEditInput').attr('class', 'form-control is-invalid');
        urlEditPass = false;
    }
};

function validateCommentEdit(edit) {
    let comment = $('#commentEditInput').val();
    if ((comment.length >= commentMinLength && comment.length <= commentMaxLength) || comment.length === 0) {
        $('#commentEditInput').attr('class', 'form-control is-valid');
        commentEditPass = true;
    } else {
        $('#commentEditInput').attr('class', 'form-control is-invalid');
        commentEditPass = false;
    }
};

function activateRegButton() {
    if (emailPass && passwordPass && passwordConfirmationPass) {
        $('#submitReg').prop('disabled', false);
    } else {
        $('#submitReg').prop('disabled', true);
    }
};

function activateSubmitButton(edit) {
    let editing = edit || false;
    if (editing) {
        if (urlEditPass && commentEditPass) {
            $('#submitCode').prop('disabled', false);
        } else {
            $('#submitCode').prop('disabled', true);
        }
    } else {
        if (urlPass && commentPass) {
            $('#submitCode').prop('disabled', false);
        } else {
            $('#submitCode').prop('disabled', true);
        }
    }
};

$('#floatingPassword')
    .keyup(function() {
        if (confirmationPassInput) {
            CheckEqualsPass();
        }
        checkLength();
        activateRegButton();
});

$('#floatingPasswordConfirm')
    .keyup(function() {
        confirmationPassInput = true;
        CheckEqualsPass();
        activateRegButton();
});

$('#floatingEmail')
    .keyup(function() {
        ValidateEmail();
        activateRegButton();
});

$('#urlInput')
    .keyup(function() {
        ValidateUrl();
        activateSubmitButton();
});

$('#commentInput')
    .keyup(function() {
        validateComment();
        activateSubmitButton();
});

$('#urlEditInput')
    .keyup(function() {
        ValidateUrlEdit();
        activateSubmitButton(true);
});

$('#commentEditInput')
    .keyup(function() {
        validateCommentEdit();
        activateSubmitButton(true);
});

function showChart(id) {
    if (!chartLoaded) {
        $.ajax({
            url: '/rehist/' + id,
        })
        .done(function(res) {
            // Hide loading animation
            $('#redirectChartLoader').hide();
            // Only display if some history found
            if (res.redirectHistory) {
                var ctxL = document.getElementById("lineChart").getContext('2d');
                var myLineChart = new Chart(ctxL, {
                type: 'line',
                data: {
                    labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                    datasets: [{
                        label: "Redirects per month 2021",
                        data: [12457, 14987, 16785, 12346, 16853, 19453, 23498, 18532, 13542, 10348, 8453, 3457],
                        backgroundColor: [
                        'rgba(105, 0, 132, .2)',
                        ],
                        borderColor: [
                        'rgba(200, 99, 132, .7)',
                        ],
                        borderWidth: 2
                    }
                    ]
                },
                options: {
                    responsive: true
                }
                });
            } else {
                $('#chartLoadError').append(`Problem loading chart. Chart does not load if there is no redirects.<br>You can also try to refresh the page.`);
            }
            chartLoaded = true;
        })
        .fail(function(err) {
            console.log('Error: ' + err.status);
        }); 
    }
};

$(function(){
    $('table#editsTable').tableSortable();
});

$(function(){
    $('table#redirectsTable').tableSortable();
});