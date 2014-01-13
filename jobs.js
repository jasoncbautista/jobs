 $(document).ready(function(){
    var JobsApp = {};

    /**
     * Makes an ajax call to the server to ask the job to be scheduled.
     * Takes two functions, one for successful scheduling, one for failed.
     *
     * @param {type} job,
     * @param {type} successCallback,
     * @param {type} failCallback,
     * @return {Null}
     */
    JobsApp.triggerJobRunNow = function(job, successCallback, failCallback) {
        var jobPromise = $.get(job.id + ".json");
        jobPromise.done(function(){
            successCallback(job);
        });

        jobPromise.fail(function(){
            failCallback(job);
        });
    };

    JobsApp.reformat = function(){
        // Make sure our jobs are formatted nicely
        d3.selectAll(".historyEntry").style("background-color", function(d, i) {
            return i % 2 ? "#99CCFF" : "#99FFFF";
        });
    };

    JobsApp.loadScheduleChooser = function(parentEl, job) {
        var timeChooserHolder = parentEl.find(".timeChooserHolder")
        timeChooserHolder.empty();
        var timeChooser = $("#timeChooser").clone();
        timeChooserHolder.append(timeChooser);
        timeChooser.show();
    };

    JobsApp.addScheduleButton = function(parentEl, job) {
        var scheduleJobEl = $("<button> Schedule </button>");
        parentEl.prepend(scheduleJobEl);
        scheduleJobEl.click(function(){
            JobsApp.loadScheduleChooser(parentEl, job);
        });

    };

    JobsApp.addRunNowButton = function(parentEl, job) {
        var scheduleJobEl = $("<button> Run Now </button>");
        parentEl.prepend(scheduleJobEl);
        scheduleJobEl.click(function(){
            JobsApp.triggerJobRunNow(
                job
            , function(job) {
        alert("success!");
            }
            , function(job) {
        alert("failed!");
            }
            );
        });
    };

    /**
     * Renders a job list element
     * @param {type} job,
     * @return {Null}
     */
    JobsApp.createJobEl= function(job) {
        var el = $("<div class='jobEntry'>" + job.id  +
                   " | <span class='jobName'> " +
                   job.description + "</span> <span> | " +
                   job.last_ran + "</span> <div class='timeChooserHolder'> </div></div>");
        // TODO: use underscore tempaltes
        JobsApp.addScheduleButton(el, job);
        JobsApp.addRunNowButton(el, job);

        el.find(".jobName").click(function(){
            // Toggle if already shown
            var detailsEl =  el.find(".details");
            if (detailsEl.length  ===  0 ) {
                var jobDetailsEl = JobsApp.createJobDetailsEl(job, function(jobDetailsEl){
                    el.append(jobDetailsEl);
                    JobsApp.reformat();
                });
            } else {
                detailsEl.remove();
            }
        });
        return el;
    };

    /**
     * Fetches the job list details from the server
     * @param {type} jobId,
     * @param {type} callback,
     * @return {Null}
     */
    JobsApp.getJobDetails = function(jobId, callback) {
        $.get(jobId + ".json", function(data) {
            callback(data.job);
        });
    };

    JobsApp.createHistoryEl = function(history) {
        return $("<div class='historyEntry'>" + history.ran + "</div>");
    };

    JobsApp.renderJobHistory = function(jobDetails, el){
        el.append($("<div> Number of times ran: " +  jobDetails.history.length + "</div>"));
        _.each(jobDetails.history, function(history){
            var historyEl = JobsApp.createHistoryEl(history);
            el.append(historyEl);
        });
    };

    /**
     * Renders / creates the job details DOM element
     * @param {type} job,
     * @param {type} callback,
     * @return {Null}
     */
    JobsApp.createJobDetailsEl = function(job, callback) {
        var details = JobsApp.getJobDetails(job.id, function(jobDetails) {
             var el = $("<div class='details'> </div>");
             JobsApp.renderJobHistory(jobDetails, el);
             callback(el);
        });
    };

    /**
     * Renders a list of jobs into DOM elements
     *
     * @param {type} listHolderEl,
     * @param {type} jobList,
     * @return {Null}
     */
    JobsApp.renderJobList = function(listHolderEl, jobList){
        listHolderEl.empty();
        _.each(jobList, function(job) {
            var jobEl = JobsApp.createJobEl(job);
            listHolderEl.append(jobEl);
        });

        // Add a little styling with d3:
        d3.selectAll(".jobEntry").style("background-color", function(d, i) {
              return i % 2 ? "white" : "#C0C0C0";
        });
    };

    function reqListener () {
        var jsonString = this.responseText;
        console.log('string', jsonString);
        var jsonObj = JSON.parse(jsonString);
        console.log(jsonObj);
        JobsApp.renderJobList($("#jobList"), jsonObj.jobs);
    }

    var oReq = new XMLHttpRequest();
    oReq.onload = reqListener;
    oReq.open("get", "job_list.json", true);
    oReq.send();
});
