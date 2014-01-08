 $(document).ready(function(){
    var JobsApp = {};



    JobsApp.triggerJobRunNow = function(job, successCallback, failCallback) {
        var jobPromise = $.get(job.id + ".json");
        jobPromise.done(function(){
            successCallback(job);
        });

        jobPromise.fail(function(){
            failCallback(job);
        });
    };
    /**
     * Renders a job list element
     * @param {type} job,
     * @return {Null}
     */
    JobsApp.createJobEl= function(job) {
        var el = $("<div>" + job.id  +   " | <span class='jobName'> " + job.description + "</span> </div>");
        // TODO: use underscore tempaltes
        var scheduleJobEl = $("<button> Run Now </button>");
        el.prepend(scheduleJobEl);
        scheduleJobEl.click(function(){
            console.log('scheduling job..', job);

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

        el.find(".jobName").click(function(){
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

    /**
     * Renders / creates the job details DOM element
     * @param {type} job,
     * @param {type} callback,
     * @return {Null}
     */
    JobsApp.createJobDetailsEl = function(job, callback) {
        var details = JobsApp.getJobDetails(job.id, function(jobDetails) {
             var el = $("<div class='details'> </div>");
             el.append(JSON.stringify(jobDetails));
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
