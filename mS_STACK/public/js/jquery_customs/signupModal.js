//show signup modal
function showDiv() {  
    $('#signup').fadeIn('slow');
}

//hide signup modal
function hideDiv() {  
    $('#signup').fadeOut('slow');
}

//closes the signup modal when you click outside of it
$(document).mouseup(function (e)
{
    var container = $("#signupModal");

    if (!container.is(e.target) // if the target of the click isn't the container...
        && container.has(e.target).length === 0) // ... nor a descendant of the container
    {
        hideDiv(); //... hide the signup modal
    }
});