

//  module.exports is an object wih key value pairs
module.exports.getDate=getDate;
module.exports.getDay=getDay;


function getDate(){
    var date = new Date().toLocaleDateString("en-US", {
        "year": "numeric",
        "month": "long",
        "weekday": "long",
        "day":"numeric"
    });

    return date;
}

function getDay(){
    var day = new Date().toLocaleDateString("en-US", {
        "weekday": "long"
    });

    return day;
}

