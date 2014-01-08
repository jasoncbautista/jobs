 $(document).ready(function(){
    var JobsApp = {};
    JobsApp.createJobEl= function(job) {
        var el = $("<div>" + job.description + "</div>");
        el.click(function(){
            // Toggle if already shown
            var detailsEl =  el.find(".details");
            if (detailsEl.length  ===  0 ) {
                var jobDetailsEl = JobsApp.createJobDetailsEl(job, function(jobDetailsEl){
                    el.append(jobDetailsEl);
                });
            } else {
                detailsEl.remove();
            }
        });
        return el;
    };

    JobsApp.getJobDetails = function(jobId, callback) {
        $.get(jobId + ".json", function(data) {
            callback(data.job);
        });
    };

    JobsApp.createJobDetailsEl = function(job, callback) {
        var details = JobsApp.getJobDetails(job.id, function(jobDetails) {
             var el = $("<div class='details'> details </div>");
             callback(el);
        });
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
