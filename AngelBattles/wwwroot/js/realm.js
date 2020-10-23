$(document).ready(function () {
    $('#cardsContainer .lazy').lazy({
        appendScroll: $('#cardsContainer')
    });

    var scene = document.getElementById('scene');
    var parallaxInstance = new Parallax(scene, {
        relativeInput: true
    });
    parallaxInstance.friction(0.2, 0.2);
});

$(document).delegate("#discordButton", "click", function (event) {
    event.stopImmediatePropagation();
    event.preventDefault();

    $("#modalDiscord").modal('show');
});