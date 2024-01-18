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

        
        
    };
    reader.readAsDataURL(input.files[0]);
    } else{
        img.src = "/img/uploadPlaceholder.png"
    }
}


function previewImageRow(element) {
    var parent = element.parentNode;
    alert(parent);
    var reader = new FileReader();
    alert(parent.id);
    var file = input.files[0];
    if(file){
    reader.onload = function() {
        

        var imgRow = parent.querySelector('img');
        imgRow.src = reader.result; 
    };
     reader.readAsDataURL(input.files[0]);
    } else{
        imgRow.src = "/img/uploadPlaceholder.png"
    };

};
   

// function previewImage(event) {
//     var input = event.target;
//     var reader = new FileReader();
//     reader.onload = function(){
//         var img = document.getElementById('imagePreview');
//         img.src = reader.result;
//         img.style.display = 'block';
//     };
//     reader.readAsDataURL(input.files[0]);
// }

function addNewImage(element){
    var parent = element.parentNode;
    var id = parent.id;
    alert(id);
    var idNo= id.substring(id.length() - 1);
    alert(idNo);
    if (idNo == i){
    var newImageUploadRow = document.createElement('div');
        newImageUploadRow.setAttribute('id','imageInRow'+ i)
        newImageUploadRow.classList.add('imageInRow' + i);
        newImageUploadRow.innerHTML = `
            <input type="file" name="eventImages" accept="image/*" onchange="previewImageRow(this); addNewImage(this)" id="eventImages${i}" style="display: none;" ">
            <img src="/img/uploadPlaceholder.png" id="imagePreviewRow${i}" class="img-fluid img-row" alt="Event Image" onclick="document.getElementById('eventImages${i}').click();" style="cursor: pointer; height:200px;">
        `;
        i++
        document.getElementById('imageUploadContainer').appendChild(newImageUploadRow);
    }
alert(i);
};

function addNew(){
    var newImageUploadRow = document.createElement('div');
        newImageUploadRow.setAttribute('id','imageInRow'+ i)
        newImageUploadRow.classList.add('imageInRow' + i);
        newImageUploadRow.innerHTML = `
            <input type="file" name="eventImages" accept="image/*" onchange="previewImageRow(this); addNewImage(this)" id="eventImages${i}" style="display: none;">
            <img src="/img/uploadPlaceholder.png" id="imagePreviewRow${i}" class="img-fluid img-row" alt="Event Image" onclick="document.getElementById('eventImages${i}').click();" style="cursor: pointer; height:200px;">
        `;
        i++
        document.getElementById('imageUploadContainer').appendChild(newImageUploadRow);
    };
