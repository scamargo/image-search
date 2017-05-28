// TODO: make example urls clickable links that open new tab
// TODO: to get rid of warning message you have to add jquery to node -- https://www.npmjs.com/package/jquery

$(document).ready(function(event) {
    
    // Update example urls
    $('#imagesearch-blank').text(window.location.origin + '/api/imagesearch/')
    $('#imagesearch-withquery').text(window.location.origin + '/api/imagesearch/professor')
    $('#imagesearch-offset').text(window.location.origin + '/api/imagesearch/?offset=1')
    $('#latest-searches').text(window.location.origin + '/api/latest/imagesearch')
    $('#addimage').text(window.location.origin + '/api/addimage?url=https://fanart.tv/fanart/movies/9678/moviethumb/little-nicky-566a799b37cf0.jpg&snippet=Little Nicky | Movie fanart')
});
