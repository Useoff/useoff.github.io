window.jsPDF = window.jspdf.jsPDF;
window.html2canvas = html2canvas;

window.onload = function() { 
  draw_screen_timeline();
  // adjust_td_mobile_ftsize();
  // alert("To proceed you must accept the terms.");
  var btn_print = document.getElementById('btn-save-img');
  btn_print.addEventListener('click', saveAsImage);
}

function generatePDF(){
  var w = window.innerWidth;
  var h = window.innerHeight;
  var base_url = window.location.origin + '/media/css/font-awesome/fonts/AvertaDemoPECuttedDemo-Regular.otf';
  var content = document.getElementById('main');
  
  var doc = jsPDF({
        orientation: 'p',
        unit: 'pt',
        format: [ w,  h],
        putOnlyUsedFonts: true
    });
  doc.html(document.documentElement, {
                callback: function (doc) {
                    doc.save('DOC.pdf');
                 }
              });
  alert(base_url);
}

function createPDF() {
  var w = window.innerWidth;
  var h = window.innerHeight;
  let jsPdf = new jsPDF('p', 'pt', [w,  h]);
    var htmlElement = document.documentElement;
    // you need to load html2canvas (and dompurify if you pass a string to html)
    const opt = {
        callback: function (jsPdf) {
            jsPdf.save("Test.pdf");
            // to open the generated PDF in browser window
            // window.open(jsPdf.output('bloburl'));
        },
        margin: [72, 72, 72, 72],
        autoPaging: 'text',
        html2canvas: {
            allowTaint: true,
            dpi: 300,
            letterRendering: true,
            logging: false,
            scale: .8
        }
    };

    jsPdf.html(htmlElement, opt);
}

function getHTMLFileName() {
  const url = new URL(window.location.href);
  const pathname = url.pathname;

  // Extract the filename from the pathname, defaulting to 'en' if not found
  const filename = pathname.split('/').pop().split('.')[0] || 'en';

  return filename.replace('cv_', '').toUpperCase();
}

function generateUniqueDateTime() {
  const now = new Date();
  // Convert to GMT+7 timezone
  now.setTime(now.getTime() + 7 * 3600000);

  // Use toISOString() and manipulate the string
  const isoString = now.toISOString();
  // Remove the 'T' and replace ':' with '-' for a filename-friendly format
  return isoString.replace(/:/g, '').replace(/\..+/g, '').replace(/-/g, '').replace('T', '_');
}

function saveAsImage() {
  location.reload() 
  var filename = "MUHAMMAD_YUSUF-"+getHTMLFileName()+"-"+generateUniqueDateTime()+".png";
  var langSelect = document.getElementById('lang-select');
  document.body.removeChild(langSelect);
  const htmlElement = document.documentElement;
  html2canvas(htmlElement).then(canvas => {
    const imgData = canvas.toDataURL('image/png')
    importAsImage(imgData, filename);
    document.body.appendChild(langSelect);
  });
}

function importAsImage(uri, filename) {
  const link = document.createElement('a');
  if (typeof link.download === 'string') {
    link.href = uri;
    link.download = filename;

    // Firefox requires the link to be in the body
    document.body.appendChild(link);

    // simulate click
    link.click();

    // remove the link when done
    document.body.removeChild(link);
  } else {
    window.open(uri);
  }
}

var have_print = 0;
var have_screen = 0;

var element;
function draw_screen_timeline() {
  element = 0;
  var code_start = document.getElementsByClassName('start-tmline');
  var code_end = document.getElementsByClassName('end-tmline');
  var html_body = document.getElementById("drawer");

  var elmnt_tmline = html_body.getElementsByClassName('screen-timeline');
  var len = code_end.length > code_start.length ? code_start.length : code_end.length;
  for (let i = 0; i < len; i++) {
    var start_bound = code_start[i].getBoundingClientRect();
    var end_bound = code_end[i].getBoundingClientRect();
    var width = Math.abs(start_bound.left - start_bound.right);
    var start_center_x = start_bound.left + width / 2;

    var start_center_y = window.pageYOffset + start_bound.bottom;
    var end_center_y = window.pageYOffset + end_bound.top;

    var height = Math.abs(start_center_y - end_center_y);
    if(have_screen == 0) {
      element = "<div class='screen-timeline' style='height:" + (height + 10) + "px;width:1pt;background-color:#a0ced9;position:absolute;top:" + (start_center_y) + "px;left:" + (start_center_x) + "px;z-index:-10;'></div>";
      html_body.innerHTML+= element;
    }
    else {
      elmnt_tmline[i].style.height  = (height+10)+"px";
      elmnt_tmline[i].style.top     = (start_center_y)+"px";
      elmnt_tmline[i].style.left    = (start_center_x)+"px";
    }
  }
  have_screen = 1;
} 

function draw_print_timeline() {
  element = 0;
  var code_start = document.getElementsByClassName('start-tmline');
  var code_end = document.getElementsByClassName('end-tmline');
  var html_body = document.getElementById("drawer");
  var body_start = html_body.getBoundingClientRect();
  
  var elmnt_tmline = html_body.getElementsByClassName('pt-timeline');
  var len = code_end.length > code_start.length ? code_start.length : code_end.length;
  var fix_offset = 0;  // the fixed offset that we dont know how tobquery it dynamically
  for (let i = 0; i < len; i++) {
    var start_bound = code_start[i].getBoundingClientRect();
    var end_bound = code_end[i].getBoundingClientRect();
    var width = Math.abs(start_bound.left - start_bound.right);
    var start_center_x = start_bound.left + width / 2;

    var start_center_y = start_bound.bottom - body_start.top - fix_offset;
    var end_center_y =  end_bound.top - body_start.top - fix_offset;
    
    var height = Math.abs(start_center_y - end_center_y);
    if(have_print == 0) { 
      element = "<div class='pt-timeline' style='height:" + (height + 10) + "px;width:1pt;background-color:#a0ced9;position:absolute;top:" + (start_center_y) + "px;left:" + (start_center_x) + "px;z-index:-10;'></div>";
      html_body.innerHTML+= element;
    }
    else {
      elmnt_tmline[i].style.height  = (height+10)+"px";
      elmnt_tmline[i].style.top     = (start_center_y)+"px";
      elmnt_tmline[i].style.left    = (start_center_x)+"px";
    }
  }
  have_print = 1;
} 

function rm_timeline() {
  var html_body = document.getElementById("drawer");
  var tmline = html_body.getElementsByClassName('pt-timeline');
  var len = tmline.length;
  for (let i = 0; i < len; i++) {
    tmline[i].remove();
  }
}

var mediaQueryList = window.matchMedia('print'); mediaQueryList.addListener(function(mql) { 
  if (mql.matches) {
    draw_print_timeline();
  }
});

// Dunno if "resize" is best. I don't know what the "change zoom" event would be
window.visualViewport.addEventListener("resize", viewportHandler);
function viewportHandler(event) {
  draw_screen_timeline();
}

function adjust_td_mobile_ftsize() {
  if(!window.mobileCheck) {
    alert("is not mobile");
    return false;
  }
  // alert("is mobile");
  // If this is an mobile let adjust the font size
  var body_elmt = document.getElementsByTagName('td');
  for(let i = 0; i < body_elmt.length; i++) {
    body_elmt[i].style.fontSize = "132.5%";
  }
  // alert(body_elmt.length);
  return true;
}

window.mobileCheck = function() { let check = false; (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera); return check; };
