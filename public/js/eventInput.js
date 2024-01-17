$(function() {
    $("#datepicker").datepicker({
        dateFormat: 'dd/mm/yy',
        minDate:0,
        onSelect: function(dateText) {
            $('#datepicker').val(dateText);
        }
    });
});


let i = 0
function previewImage(event) {
    var input = event.target;
    var reader = new FileReader();
    var file = input.files[0]; //get selected file
    if(file){
    reader.onload = function(){
        var img = document.getElementById('imagePreview');
        var thumbnail = document.getElementById('thumbnail');
        thumbnail.src = reader.result;
        img.src = reader.result;
        img.style.display = 'block';

        var newImageUploadRow = document.createElement('div');
        newImageUploadRow.classList.add('imageInRow');
        newImageUploadRow.innerHTML = `
            <input type="file" name="eventImages" accept="image/*" onchange="previewImageRow(event)" id="eventImages${i}" style="display: none;">
            <img src="/img/uploadPlaceholder.png" id="imagePreviewRow${i}" class="img-fluid img-row" alt="Event Image" onclick="document.getElementById('eventImages${i}').click();" style="cursor: pointer; height:200px;">
        `;
        document.getElementById('imageUploadContainer').appendChild(newImageUploadRow);
        
    };
    reader.readAsDataURL(input.files[0]);
    } else{
        img.src = "/img/uploadPlaceholder.png"
    }
}


function previewImageRow(event) {
    var input = event.target;
    var reader = new FileReader();
    var file = input.files[0];
    if(file){
    reader.onload = function() {
        var newImageUploadRow = document.createElement('div');
        newImageUploadRow.classList.add('imageInRow');
        newImageUploadRow.innerHTML = `
            <input type="file" name="eventImages" accept="image/*" onchange="previewImageRow(event)" id="eventImages${i}" style="display: none;">
            <img src="" id="imagePreviewRow${i}" class="img-fluid img-row" alt="Event Image" onclick="document.getElementById('eventImages${i}').click();" style="cursor: pointer; height:200px;">
        `;
        document.getElementById('imageUploadContainer').appendChild(newImageUploadRow);

        var imgRow = document.getElementById('imagePreviewRow' + i);
        imgRow.src = reader.result; 
    };
     reader.readAsDataURL(input.files[0]);
    } else{
        imgRow.src = "/img/uploadPlaceholder.png"
    };

    i++
};
   