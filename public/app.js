console.log('hello app');



$( document ).ready(function() {


  $('select').on('change', function() {

    let val = $('select').val();
    if(val==='staff'){
      $('div').hide();

      $('body').children().forEach(ele =>{


        if( $(ele).attr('class')===true){

          ele.hide();
        }

      });

    }

  });
});
