<template>
    <div>
        <Navbar @query-class="queryClass()" />

        <div>
            <div class="p-3">
                <h3 class="text-start text-primary">Classes</h3>
                <div class="row">
                    <div v-for="item in classData" :key="item.id" :classData="item.data" @click="selectClass(item)" data-bs-toggle="modal" data-bs-target="#exampleModal" class="col-6 p-1">
                        <div class="card p-3" style="cursor: pointer;">
                            <p>{{item.data.name}}</p>
                            <p>{{item.data.code}}</p>
                        </div>
                    </div>
                </div>
                <div v-if="classData.length == 0" class="alert alert-secondary">
                    No classes yet.
                </div>
            </div>

            <div id="exampleModal" class="modal" tabindex="-1">
            <div class="modal-dialog modal-fullscreen">
                <div class="modal-content p-5">
                <div class="modal-header">
                    <h5 class="modal-title">{{this.selectedClass.name}} <small>({{this.selectedClass.code}})</small></h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                    <div class="row text-start">
                        <div class="col-3">
                            <p>{{this.selectedClass.description}}</p>
                            &nbsp;
                            <p>Created by <span class="text-primary">{{this.selectedClass.createdBy}}</span></p>
                        </div>

                        <div class="col-9">
                            <ul class="nav nav-tabs" id="myTab" role="tablist">
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link active" id="resource-tab" data-bs-toggle="tab" data-bs-target="#resource-tab-pane" type="button" role="tab" aria-controls="resource-tab-pane" aria-selected="true">Resources</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="schedule-tab" data-bs-toggle="tab" data-bs-target="#schedule-tab-pane" type="button" role="tab" aria-controls="schedule-tab-pane" aria-selected="false">Schedule</button>
                                </li>
                                <li class="nav-item" role="presentation">
                                    <button class="nav-link" id="participants-list-tab" data-bs-toggle="tab" data-bs-target="#participants-list-tab-pane" type="button" role="tab" aria-controls="participants-list-tab-pane" aria-selected="false">Participants</button>
                                </li>
                            </ul>
                            <div class="tab-content overflow-auto" id="myTabContent">
                                <div class="tab-pane fade show active py-3" id="resource-tab-pane" role="tabpanel" aria-labelledby="resource-tab" tabindex="0">
                                    <div v-for="resource in classResources" :key="resource.id" class="card p-3 mb-1">
                                        <div class="d-flex">
                                            <p class="mb-1 my-auto text-primary flex-grow-1"><i class="bi bi-file-earmark-fill me-1"></i>{{resource.name}}</p>
                                            
                                            <button v-if="userRole == 'teacher'" @click="deleteResource(resource.id)" class="btn btn-sm btn-light bg-white" type="button">
                                                <i class="bi bi-trash-fill text-danger" style="cursor: pointer;"></i>
                                            </button>
                                        </div>
                                        <small>{{resource.description}}</small>
                                        
                                            
                                        <p>
                                            <button @click="downloadResource(resource.file, resource.name)" class="btn btn-sm btn-light bg-white text-primary float-start mt-2">
                                                <i class="bi bi-download"></i>&nbsp;&nbsp;Download
                                            </button>
                                        </p>
                                    </div>
                                    <div v-if="classResources && classResources.length == 0" class="alert alert-secondary">
                                        No resources yet.
                                    </div>
                                </div>
                                <div class="tab-pane fade py-3" id="schedule-tab-pane" role="tabpanel" aria-labelledby="schedule-tab" tabindex="0">
                                    <div v-if="classSchedule">
                                        <div class="card p-3 mb-1 alert" :class="classSchedule.mon.time != '' ? setScheduleColor(classSchedule.mon.type) : 'alert-secondary'">
                                            <p class="text-bold">Monday</p>
                                            <small v-if="classSchedule.mon.time != ''">{{classSchedule.mon.time}} - {{classSchedule.mon.type}}</small>
                                            <small v-if="classSchedule.mon.time != ''">{{classSchedule.mon.location}}</small>
                                            <small v-if="classSchedule.mon.time == ''">None</small>
                                        </div>
                                        <div class="card p-3 mb-1 alert" :class="classSchedule.tue.time != '' ? setScheduleColor(classSchedule.tue.type) : 'alert-secondary'">
                                            <p class="text-bold">Tuesday</p>
                                            <small v-if="classSchedule.tue.time != ''">{{classSchedule.tue.time}} - {{classSchedule.tue.type}}</small>
                                            <small v-if="classSchedule.tue.time != ''">{{classSchedule.tue.location}}</small>
                                            <small v-if="classSchedule.tue.time == ''">None</small>
                                        </div>
                                        <div class="card p-3 mb-1 alert" :class="classSchedule.wed.time != '' ? setScheduleColor(classSchedule.wed.type) : 'alert-secondary'">
                                            <p class="text-bold">Wednesday</p>
                                            <small v-if="classSchedule.wed.time != ''">{{classSchedule.wed.time}} - {{classSchedule.wed.type}}</small>
                                            <small v-if="classSchedule.wed.time != ''">{{classSchedule.wed.location}}</small>
                                            <small v-if="classSchedule.wed.time == ''">None</small>
                                        </div>
                                        <div class="card p-3 mb-1 alert" :class="classSchedule.thu.time != '' ? setScheduleColor(classSchedule.thu.type) : 'alert-secondary'">
                                            <p class="text-bold">Thursday</p>
                                            <small v-if="classSchedule.thu.time != ''">{{classSchedule.thu.time}} - {{classSchedule.thu.type}}</small>
                                            <small v-if="classSchedule.thu.time != ''">{{classSchedule.thu.location}}</small>
                                            <small v-if="classSchedule.thu.time == ''">None</small>
                                        </div>
                                        <div class="card p-3 mb-1 alert" :class="classSchedule.fri.time != '' ? setScheduleColor(classSchedule.fri.type) : 'alert-secondary'">
                                            <p class="text-bold">Friday</p>
                                            <small v-if="classSchedule.fri.time != ''">{{classSchedule.fri.time}} - {{classSchedule.fri.type}}</small>
                                            <small v-if="classSchedule.fri.time != ''">{{classSchedule.fri.location}}</small>
                                            <small v-if="classSchedule.fri.time == ''">None</small>
                                        </div>
                                    </div>
                                </div>
                                <div class="tab-pane fade py-3" id="participants-list-tab-pane" role="tabpanel" aria-labelledby="participants-list-tab" tabindex="0">
                                    <div class="row g-0">
                                        <div v-for="student in classParticipants" :key="student.id" class="col-6 p-1">
                                            <div class="card p-3">
                                                <div class="d-flex">
                                                    <div class="flex-grow-1 my-auto">{{student.data.name}}</div>
                                                </div>
                                            </div>
                                        </div>
                                                
                                        <div v-if="classParticipants.length == 0" class="alert alert-secondary">
                                            No students yet.
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                    <button v-if="userRole == 'teacher'" class="btn btn-primary" type="button" data-bs-toggle="offcanvas" data-bs-target="#uploadFileOffcanvas" aria-controls="uploadFileOffcanvas">
                        Upload a file
                    </button>
                    <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
                </div>
                </div>
            </div>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="uploadFileOffcanvas" aria-labelledby="uploadFileOffcanvasLabel">
            <div class="offcanvas-header">
                <h5 class="offcanvas-title" id="uploadFileOffcanvasLabel">Upload File</h5>
                <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
            </div>
            <div class="offcanvas-body text-start">
                <form>
                    <div class="mb-3">
                        <label for="inputFile" class="form-label">File <span class="text-danger">*</span></label>
                        <input v-on:change="uploadToBucket($event)" class="form-control" type="file" id="inputFile">
                    </div>
                    <div class="progress mb-3" role="progressbar" aria-label="Basic example" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="height: 3px">
                        <div id="uploadProgressBar" class="progress-bar" style="width: 0%"></div>
                    </div>
                    <div class="mb-3">
                        <label for="uploadFileName" class="form-label">File Name <span class="text-danger">*</span></label>
                        <input v-model="uploadFileName" type="text" class="form-control" id="uploadFileName" aria-describedby="classNameHelp">
                        <!-- <div id="classNameHelp" class="form-text">We'll never share your email with anyone else.</div> -->
                    </div>
                    <div class="mb-3">
                        <label for="uploadFileDescription" class="form-label">Description</label>
                        <textarea v-model="uploadFileDesc" class="form-control" id="uploadFileDescription" rows="6"></textarea>
                    </div>
                </form>
                <button class="btn btn-outline-secondary w-100" @click="createResource()" :disabled="disableResourceButton" data-bs-dismiss="offcanvas" data-bs-target="#uploadFileOffcanvas" aria-label="Close">
                    <p><i class="bi bi-pencil-fill me-2"></i>Upload File</p>
                </button>
            </div>
        </div>
            </div>
        </div>
    </div>
</template>

<script>
import Navbar from './Navbar.vue'
import { DataStore } from '@aws-amplify/datastore';
import { Classes, Resources, User } from '../models';
import { Storage } from "@aws-amplify/storage"
import { useToast } from "vue-toastification";

export default {
    name: 'ClassesSection',
    setup() {
        const toast = useToast();
        return { toast }
    },
    data() {
      return {
        classData: {},
        selectedClass: {},
        selectedClassId: '',
        classResources: {},
        classSchedule: null,
        classParticipants: [],
        
        userRole: '',
        userId: '',

        uploadTotal: 0,
        uploadProgress: 0,

        uploadFileName: '',
        uploadFileDesc: '',
        uploadFileKey: '',

        disableResourceButton: true,
      }  
    },
    components: {
        Navbar
    },
    methods: {
        async queryClass() {
            if (this.userRole == 'teacher') {
                const models = await DataStore.query(Classes, c => c.userid.contains(this.userId));
                this.classData = models
                console.log(this.classData)
            } else {
                const models = await DataStore.query(Classes, c => c.participants.contains(this.userId));
                this.classData = models
                console.log(this.classData)
            }
        },

        async queryResource() {
            const models = await DataStore.query(Resources, c => c.classid.contains(this.selectedClassId));
            this.classResources = models
            console.log(this.classResources)
        },

        async createResource() {
            await DataStore.save(
                new Resources({
                    'name': this.uploadFileName,
                    'description': this.uploadFileDesc,
                    'file': this.uploadFileKey,
                    'classid': this.selectedClassId
                })
            );

            this.toast.success('Resource uploaded successfully.')

            this.queryResource();
            
            this.uploadFileName = ''
            this.uploadFileDesc = ''
            this.uploadFileKey = ''
            this.disableResourceButton = true
            document.getElementById("inputFile").value = null
            document.getElementById("uploadProgressBar").style.width = '0'
        },

        async deleteResource(id) {
            const modelToDelete = await DataStore.query(Resources, id);
            DataStore.delete(modelToDelete);
            this.queryResource();

            this.toast.success('Resource deleted successfully.')
        },

        async downloadResource(key, filename) {
            const result = await Storage.get(key, { download: true });

            this.downloadBlob(result.Body, filename);
        },

        downloadBlob(blob, filename) {
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = filename || 'download';
            const clickHandler = () => {
                setTimeout(() => {
                URL.revokeObjectURL(url);
                a.removeEventListener('click', clickHandler);
                }, 150);
            };
            a.addEventListener('click', clickHandler, false);
            a.click();
            return a;
        },

        async uploadToBucket(e) {
            const file = e.target.files[0];
            const filename = file.name.replace(/\s/g, '')
            this.uploadFileName = filename
            this.uploadFileKey = `${this.selectedClassId}/${filename}`
            try {
                await Storage.put(this.uploadFileKey, file, {
                    progressCallback(progress) {
                        let x = progress.loaded/progress.total * 100
                        document.getElementById("uploadProgressBar").style.width = `${x}%`
                    },
                }).then(() => {
                    this.disableResourceButton = false
                })
            } catch (error) {
                console.log("Error uploading file: ", error);
                this.toast.error('Error uploading file.')
            }
        },

        selectClass(item) {
            this.classParticipants = []
            this.selectedClass = item.data;
            this.classResources = item.resource;
            this.selectedClassId = item.id
            this.classSchedule = item.data.schedule
            item.participants.forEach(async studentid => {
                this.classParticipants.push(await DataStore.query(User, studentid))
            })
            console.log(this.classParticipants, this.classParticipants.length)
            
            this.queryResource();
        },

        setScheduleColor(type) {
            let style = ''
            if (type == "Lecture") {
                style = 'alert-primary'
            } else if (type == "Tutorial") {
                style = 'alert-warning'
            } else if (type == "Lab") {
                style = 'alert-danger'
            } 
            return style
        },
    },
    beforeMount() {
        this.userId = localStorage.getItem("userId")
        this.userRole = localStorage.getItem("userRole")
        this.queryClass();
    }
}
</script>

<style>
p {
    margin: 0
}

.card:hover {
    box-shadow: 0 .125rem .25rem rgba(var(--bs-body-color-rgb),.075)!important;
}
</style>