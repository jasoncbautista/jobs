 $(document).ready(function(){
    var JobsApp = {};
    JobsApp.createJobEl= function(job) {
        var el = $("<div>" + job.description + "</div>");
        el.click(function(){
            el.remove(".details");
            var jobDetailsEl = JobsApp.createJobDetailsEl();
            el.append(jobDetailsEl);
        });
        return el;
    };

    JobsApp.getJobDetails = function(id) {
        return {
            "details": []
        }
    };

    JobsApp.createJobDetailsEl = function(job) {
        return $("<div class='details'> details </div>");
    };
    JobsApp.renderList = function(listHolderEl, jobList){
        _.each(jobList, function(job) {
            console.log('job', job);
            var jobEl = JobsApp.createJobEl(job);
            listHolderEl.append(jobEl);
        });
    };

    function reqListener () {
        var jsonString = this.responseText;
        console.log('string', jsonString);
        var jsonObj = JSON.parse(jsonString);
        console.log(jsonObj);
        JobsApp.renderList($("#jobList"), jsonObj.jobs);
    }

    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.open("get", "job_list.json", true);
    oReq.send();
});
