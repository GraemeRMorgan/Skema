let $calendar;
let coursesInSideBar = [];
let courseIdsInSideBar = {};
let courseIdsInCalendar = [];
let backgroundColors = ["darkgreen", "gold", "red", "midnightblue", "saddlebrown", "lawngreen", "darkorange",
    "lightsalmon", "cyan", "black", "purple", "indigo"];
let textColors = ["white", "black", "black", "white", "black", "black", "white", "black", "black", "white", "white", "white"];

function getCoursesFromServer(subject, professor, check100, check200, check300, check400, checkOther, displayedCoursesList) {
    let subjectString = subject.options[subject.selectedIndex].text;
    let profString = professor.options[professor.selectedIndex].text;

    let requestURL = "http://localhost:5000/data?subject=" + subjectString + "&prof=" + profString;
    if(check100.checked === true) requestURL += "&level100=true";
    if(check200.checked === true) requestURL += "&level200=true";
    if(check300.checked === true) requestURL += "&level300=true";
    if(check400.checked === true) requestURL += "&level400=true";
    if(checkOther.checked === true) requestURL += "&levelOther=true";

    let dataRequest = new XMLHttpRequest();
    dataRequest.onreadystatechange = function() {
        if(this.readyState === 4 && this.status === 200) {
            let coursesReturnedFromServer = JSON.parse(this.responseText);
            coursesInSideBar = coursesReturnedFromServer.classes;
            courseIdsInSideBar = {};
            appendCourseTitleWithSection(coursesInSideBar);
            collateCourseIds();
            displayedCoursesList.innerHTML = null;
            let newDisplayedCoursesList = "";
            for(let courseId in courseIdsInSideBar){
                newDisplayedCoursesList += "<li><a href=\"#\" onclick='addCourseToCalendar(this)'>" + courseId + "</a></li>\n";
            }
            displayedCoursesList.innerHTML = newDisplayedCoursesList;
        }
    };
    dataRequest.open("GET", requestURL);
    dataRequest.send();
}

function appendCourseTitleWithSection(dictionaries){
    for(let i=0; i<dictionaries.length; i++){
        let componentId = dictionaries[i]["component_id"];
        if(componentId.charAt(0) === 'T'){
            dictionaries[i]["_id"] = dictionaries[i]["title"] + " Tutorials";
            dictionaries[i]["title"] += " " + componentId;
        }
        else if(componentId.charAt(0) === 'L'){
            dictionaries[i]["_id"] = dictionaries[i]["title"] + " Labs";
            dictionaries[i]["title"] += " " + componentId;
        }
        else{
            dictionaries[i]["title"] += " " + componentId;
            dictionaries[i]["_id"] = dictionaries[i]["title"];
        }
    }
}

function collateCourseIds(){
    for(let i=0; i<coursesInSideBar.length; i++){
        courseIdsInSideBar[coursesInSideBar[i]["_id"]] = 1;
    }
}

function addCourseToCalendar(courseClicked){
    let courseId = courseClicked.innerText;
    if(!courseIdsInCalendar.includes(courseId)) {
        for (let i = 0; i < coursesInSideBar.length; i++) {
            if (courseId === coursesInSideBar[i]["_id"]) {
                coursesInSideBar[i]["color"] = backgroundColors[courseIdsInCalendar.length % 12];
                coursesInSideBar[i]["textColor"] = textColors[courseIdsInCalendar.length % 12]
                $calendar.fullCalendar('renderEvent', coursesInSideBar[i], true);
            }
        }
        courseIdsInCalendar.push(courseId);
    }
    courseClicked.value = "new value";
}

function loadCalendar() {
    $calendar = $('#calendar').fullCalendar({
        defaultView: 'agendaWeek',
        columnFormat: 'ddd',
        allDaySlot: false,
        defaultDate: '2018-01-01',
        minTime: "07:00:00",
        maxTime: "22:00:00",
        header: false,
        hiddenDays: [0],
        editable: false,
        eventLimit: true, // allow "more" link when too many events
        themeSystem: 'bootstrap4',
        events: [],
        height: 'auto'
    });
}