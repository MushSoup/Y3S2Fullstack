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
    var img = document.getElementById('imagePreview');
    var thumbnail = document.getElementById('thumbnail');
    if(file){
    reader.onload = function(){
        thumbnail.src = reader.result;
        img.src = reader.result;
        img.style.display = 'block';
    };
    reader.readAsDataURL(input.files[0]);
    } else{
        img.src = "/img/uploadPlaceholder.png";
        thumbnail.src= "/img/uploadPlaceholder.png";
    }
}


function previewImageRow(element) {
    var input = element;
    var parent = element.parentNode;
    var reader = new FileReader();
    var imgRow = parent.querySelector('img')
    var file = input.files[0];
    if(file){
    reader.onload = function() {
        imgRow.src = reader.result; 
    };
     reader.readAsDataURL(input.files[0]);
    } else{
        imgRow.src = "/img/uploadPlaceholder.png"
    };

};
   


function addNewImage(){
    if (i < 4) {
        
    

    var newImageUploadRow = document.createElement('div');
        newImageUploadRow.setAttribute('id','imageInRow'+ i)
        newImageUploadRow.classList.add('imageInRow' + i);
        newImageUploadRow.innerHTML = `
            <input type="file" name="eventImages" accept="image/*" onchange="previewImageRow(this);" id="eventImages${i}" class="hidden-input">
            <img src="/img/uploadPlaceholder.png" id="imagePreviewRow${i}" class="img-fluid img-row" alt="Event Image" onclick="document.getElementById('eventImages${i}').click();" style="cursor: pointer; height:250px;">
        `;
        i++
        document.getElementById('image-row').appendChild(newImageUploadRow);
}
};

function deleteImage(){
    if (i >= 1) {
        
   
    i--;
    var element = document.getElementById('imageInRow' + i);
    element.remove();
 }
}
