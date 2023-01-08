<template>
  <div class="float-end">
    <div class="dropdown">
      <button class="btn btn-light bg-white text-primary dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
        {{this.userName}}
      </button>
      <ul class="dropdown-menu dropdown-menu-end">
        <li v-if="this.userRole == 'teacher'"><a class="dropdown-item" href="#" data-bs-toggle="modal" data-bs-target="#controlPanel">Control Panel</a></li>
        <li v-if="this.userRole == 'teacher'"><hr class="dropdown-divider"></li>
        <li><a @click="logoutUser()" class="dropdown-item text-danger" href="#">Logout</a></li>
      </ul>
    </div>
  </div>

  <div id="controlPanel" class="modal" tabindex="-1">
        <div class="modal-dialog modal-fullscreen">
            <div class="modal-content p-5">
            <div class="modal-header">
                <h5 class="modal-title">Control Panel</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body">
              <div>
                        <ul class="nav nav-tabs" id="myTab" role="tablist">
                            <li class="nav-item" role="presentation">
                                <button class="nav-link active" id="classes-tab" data-bs-toggle="tab" data-bs-target="#classes-tab-pane" type="button" role="tab" aria-controls="classes-tab-pane" aria-selected="true">Classes</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="set-schedule-tab" data-bs-toggle="tab" data-bs-target="#set-schedule-tab-pane" type="button" role="tab" aria-controls="set-schedule-tab-pane" aria-selected="false">Schedule</button>
                            </li>
                            <li class="nav-item" role="presentation">
                                <button class="nav-link" id="students-tab" data-bs-toggle="tab" data-bs-target="#students-tab-pane" type="button" role="tab" aria-controls="students-tab-pane" aria-selected="false">Students</button>
                            </li>
                        </ul>
                        <div class="tab-content overflow-hidden" id="myTabContent">
                          <div class="tab-pane fade show active py-3" id="classes-tab-pane" role="tabpanel" aria-labelledby="classes-tab" tabindex="0">
                              <div class="row">
                                <div class="col-6 text-start">
                                  <div class="card p-3">
                                    <h5 class="mb-3 text-primary">Create Class</h5>
                                    <form>
                                      <div class="mb-3">
                                        <label for="inputClassName" class="form-label">Class Name <span class="text-danger">*</span></label>
                                        <input v-model="className" v-on:change="validateAddClass()" type="email" class="form-control" id="inputClassName" aria-describedby="classNameHelp">
                                        <!-- <div id="classNameHelp" class="form-text">We'll never share your email with anyone else.</div> -->
                                      </div>
                                      <div class="mb-3">
                                        <label for="inputClassCode" class="form-label">Class Code <span class="text-danger">*</span></label>
                                        <input v-model="classCode" v-on:change="validateAddClass()" type="email" class="form-control" id="inputClassCode" aria-describedby="classCodeHelp">
                                        <!-- <div id="classCodeHelp" class="form-text">We'll never share your email with anyone else.</div> -->
                                      </div>
                                      <div class="mb-3">
                                        <label for="inputClassDescription" class="form-label">Description</label>
                                        <textarea v-model="classDesc" class="form-control" id="inputClassDescription" rows="3"></textarea>
                                      </div>
                                    </form>
                                    <button class="btn btn-outline-secondary w-100" @click="createClass()" :disabled="disableAddClass">
                                        <p><i class="bi bi-plus-circle me-2"></i>Create Class</p>
                                    </button>
                                  </div>
                                </div>

                                <div class="col-6 text-start">
                                  <div class="card p-3">
                                    <h5 class="mb-3 text-primary">Edit Class</h5>
                                    <!-- <Class v-for="item in classData" :key="item.id" :classData="item.data" data-bs-toggle="modal" data-bs-target="#exampleModal"/> -->
                                    <div>
                                        <div v-for="item in classData" :key="item.id" class="card p-3 mb-1">
                                          <div class="d-flex">
                                            <div class="flex-grow-1 my-auto">{{item.data.name}} <small>({{item.data.code}})</small></div>
                                            <button @click="selectEditClass(item.id, item.data)" class="btn btn-sm btn-light bg-white me-2" type="button" data-bs-toggle="offcanvas" data-bs-target="#offcanvasExample" aria-controls="offcanvasExample">
                                              <i class="bi bi-pencil-square" style="cursor: pointer;"></i>
                                            </button>
                                            <div class="dropdown">
                                              <button class="btn btn-sm btn-light bg-white dropdown-toggle" type="button" data-bs-toggle="dropdown" aria-expanded="false">
                                                <i class="bi bi-trash-fill text-danger" style="cursor: pointer;"></i>
                                              </button>
                                              <div class="dropdown-menu p-3 text-muted">
                                                <p class="text-danger text-center mb-2">Delete this class?</p>
                                                <div class="d-flex">
                                                  <button type="submit" class="btn btn-sm btn-danger me-2" @click="deleteClass(item.id)">Confirm</button>
                                                  <button type="submit" class="btn btn-sm btn-secondary">Cancel</button>
                                                </div>
                                              </div>
                                            </div>
                                          </div>
                                        </div>

                                        <div v-if="classData.length == 0" class="alert alert-secondary">
                                            No classes yet.
                                        </div>
                                    </div>
                                  </div> 
                                </div>
                              </div>
                          </div>

                          <div class="tab-pane fade py-3" id="set-schedule-tab-pane" role="tabpanel" aria-labelledby="set-schedule-tab" tabindex="0">
                            <div class="row">
                                <div class="col-6 text-start">
                                  <div class="card p-3">
                                    <h5 class="mb-3 text-primary">Set Schedule</h5>
                                    <!-- <Class v-for="item in classData" :key="item.id" :classData="item.data" data-bs-toggle="modal" data-bs-target="#exampleModal"/> -->
                                    <div>
                                        <div @click="showSetSchedule(item.id, item.data.schedule, item.data.name)" v-for="item in classData" :key="item.id" class="card p-3 mb-1" style="cursor: pointer">
                                          <div class="d-flex">
                                            <div class="flex-grow-1 my-auto">{{item.data.name}} <small>({{item.data.code}})</small></div>
                                          </div>
                                        </div>
                                        
                                        <div v-if="classData.length == 0" class="alert alert-secondary">
                                            No classes yet.
                                        </div>
                                    </div>
                                  </div> 
                                </div>

                                <div v-show="isSettingSchedule" class="col-6 text-start">
                                  <div class="card p-3">
                                    <h5 class="mb-3 text-primary">Setting Schedule for {{selectedClassNameSchedule}}</h5>
                                    <!-- <Class v-for="item in classData" :key="item.id" :classData="item.data" data-bs-toggle="modal" data-bs-target="#exampleModal"/> -->
                                    <form>
                                      <div class="mb-3">
                                        <label for="sceduleMonday" class="form-label">Monday</label>
                                        <div class="row g-3 align-items-center">
                                          <div class="col-auto">
                                            <input v-model="mondayTime" placeholder="Time" type="text" id="mondayTime" class="form-control">
                                          </div>
                                          <div class="col-auto">
                                            <input v-model="mondayLocation" placeholder="Location" type="text" id="mondayLocation" class="form-control">
                                          </div>
                                          <div class="col-auto">
                                            <select v-model="mondayType" class="form-select" id="mondayType">
                                              <option value="Lecture">Lecture</option>
                                              <option value="Tutorial">Tutorial</option>
                                              <option value="Lab">Lab</option>
                                            </select>
                                          </div>
                                        </div>
                                        <!-- <input v-model="monday" type="text" class="form-control" id="sceduleMonday"> -->
                                      </div>
                                      <div class="mb-3">
                                        <label for="sceduleTuesday" class="form-label">Tuesday</label>
                                        <div class="row g-3 align-items-center">
                                          <div class="col-auto">
                                            <input v-model="tuesdayTime" placeholder="Time" type="text" id="tuesdayTime" class="form-control">
                                          </div>
                                          <div class="col-auto">
                                            <input v-model="tuesdayLocation" placeholder="Location" type="text" id="tuesdayLocation" class="form-control">
                                          </div>
                                          <div class="col-auto">
                                            <select v-model="tuesdayType" class="form-select" id="tuesdayType">
                                              <option value="Lecture">Lecture</option>
                                              <option value="Tutorial">Tutorial</option>
                                              <option value="Lab">Lab</option>
                                            </select>
                                          </div>
                                        </div>
                                        <!-- <input v-model="tuesday" type="text" class="form-control" id="sceduleTuesday"> -->
                                      </div>
                                      <div class="mb-3">
                                        <label for="sceduleWednesday" class="form-label">Wednesday</label>
                                        <div class="row g-3 align-items-center">
                                          <div class="col-auto">
                                            <input v-model="wednesdayTime" placeholder="Time" type="text" id="wednesdayTime" class="form-control">
                                          </div>
                                          <div class="col-auto">
                                            <input v-model="wednesdayLocation" placeholder="Location" type="text" id="wednesdayLocation" class="form-control">
                                          </div>
                                          <div class="col-auto">
                                            <select v-model="wednesdayType" class="form-select" id="wednesdayType">
                                              <option value="Lecture">Lecture</option>
                                              <option value="Tutorial">Tutorial</option>
                                              <option value="Lab">Lab</option>
                                            </select>
                                          </div>
                                        </div>
                                        <!-- <input v-model="wednesday" type="text" class="form-control" id="sceduleWednesday"> -->
                                      </div>
                                      <div class="mb-3">
                                        <label for="sceduleThursday" class="form-label">Thursday</label>
                                        <div class="row g-3 align-items-center">
                                          <div class="col-auto">
                                            <input v-model="thursdayTime" placeholder="Time" type="text" id="thursdayTime" class="form-control">
                                          </div>
                                          <div class="col-auto">
                                            <input v-model="thursdayLocation" placeholder="Location" type="text" id="thursdayLocation" class="form-control">
                                          </div>
                                          <div class="col-auto">
                                            <select v-model="thursdayType" class="form-select" id="thursdayType">
                                              <option value="Lecture">Lecture</option>
                                              <option value="Tutorial">Tutorial</option>
                                              <option value="Lab">Lab</option>
                                            </select>
                                          </div>
                                        </div>
                                        <!-- <input v-model="thursday" type="text" class="form-control" id="sceduleThursday"> -->
                                      </div>
                                      <div class="mb-3">
                                        <label for="sceduleFriday" class="form-label">Friday</label>
                                        <div class="row g-3 align-items-center">
                                          <div class="col-auto">
                                            <input v-model="fridayTime" placeholder="Time" type="text" id="fridayTime" class="form-control">
                                          </div>
                                          <div class="col-auto">
                                            <input v-model="fridayLocation" placeholder="Location" type="text" id="fridayLocation" class="form-control">
                                          </div>
                                          <div class="col-auto">
                                            <select v-model="fridayType" class="form-select" id="fridayType">
                                              <option value="Lecture">Lecture</option>
                                              <option value="Tutorial">Tutorial</option>
                                              <option value="Lab">Lab</option>
                                            </select>
                                          </div>
                                        </div>
                                        <!-- <input v-model="friday" type="text" class="form-control" id="sceduleFriday"> -->
                                      </div>
                                    </form>
                                        
                                    <button class="btn btn-outline-secondary w-100 mt-2" @click="setSchedule()">
                                        <p><i class="bi bi-calendar-check me-2"></i>Save Schedule</p>
                                    </button>
                                  </div> 
                                </div>
                              </div>
                          </div>

                          <div class="tab-pane fade py-3" id="students-tab-pane" role="tabpanel" aria-labelledby="students-tab" tabindex="0">
                            <div class="row">
                                <div class="col-6 text-start">
                                  <div class="card p-3">
                                    <h5 class="mb-3 text-primary">Assign Participants</h5>
                                    <!-- <Class v-for="item in classData" :key="item.id" :classData="item.data" data-bs-toggle="modal" data-bs-target="#exampleModal"/> -->
                                    <div>
                                        <div @click="showAssignParticipant(item.id, item.participants, item.data.name)" v-for="item in classData" :key="item.id" class="card p-3 mb-1" style="cursor: pointer">
                                          <div class="d-flex">
                                            <div class="flex-grow-1 my-auto">{{item.data.name}} <small>({{item.data.code}})</small></div>
                                          </div>
                                        </div>
                                        
                                        <div v-if="classData.length == 0" class="alert alert-secondary">
                                            No classes yet.
                                        </div>
                                    </div>
                                  </div> 
                                </div>

                                <div v-show="isAssigningParticipant" class="col-6 text-start">
                                  <div class="card p-3">
                                    <h5 class="mb-3 text-primary">Select Participant(s) for {{selectedClassNameParticipants}}</h5>
                                    <!-- <Class v-for="item in classData" :key="item.id" :classData="item.data" data-bs-toggle="modal" data-bs-target="#exampleModal"/> -->
                                    <div>
                                        <div v-for="student in studentList" :key="student.id" class="card p-3 mb-1" style="cursor: pointer">
                                          <div class="d-flex">
                                            <input v-model="participantList" :value="student.id" class="form-check-input my-auto me-2" type="checkbox">
                                            <div class="flex-grow-1 my-auto">{{student.data.name}}</div>
                                          </div>
                                        </div>
                                        
                                        <div v-if="studentList.length == 0" class="alert alert-secondary">
                                            No students yet.
                                        </div>
                                    </div>
                                        
                                    <button v-if="studentList.length > 0" class="btn btn-outline-secondary w-100 mt-2" @click="assignParticipants()">
                                        <p><i class="bi bi-person-plus-fill me-2"></i>Assign Participants</p>
                                    </button>
                                  </div> 
                                </div>
                              </div>
                          </div>
                        </div>
                    </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <!-- <button type="button" class="btn btn-primary">Save changes</button> -->
            </div>
            </div>
        </div>

        <div class="offcanvas offcanvas-end" tabindex="-1" id="offcanvasExample" aria-labelledby="offcanvasExampleLabel">
          <div class="offcanvas-header">
            <h5 class="offcanvas-title text-primary" id="offcanvasExampleLabel">Edit Class</h5>
            <button type="button" class="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></button>
          </div>
          <div class="offcanvas-body text-start">
            <form>
              <div class="mb-3">
                <label for="inputEditClassName" class="form-label">Class Name</label>
                <input v-model="editClassName" type="text" class="form-control" id="inputEditClassName" aria-describedby="classNameHelp">
                <!-- <div id="classNameHelp" class="form-text">We'll never share your email with anyone else.</div> -->
              </div>
              <div class="mb-3">
                <label for="inputEditClassCode" class="form-label">Class Code</label>
                <input v-model="editClassCode" type="text" class="form-control" id="inputEditClassCode" aria-describedby="classCodeHelp">
                <!-- <div id="classCodeHelp" class="form-text">We'll never share your email with anyone else.</div> -->
              </div>
              <div class="mb-3">
                <label for="inputEditClassDescription" class="form-label">Description</label>
                <textarea v-model="editClassDesc" class="form-control" id="inputEditClassDescription" rows="6"></textarea>
              </div>
            </form>
            <button class="btn btn-outline-secondary w-100" @click="editClass()" data-bs-dismiss="offcanvas" data-bs-target="#offcanvasExample" aria-label="Close">
                <p><i class="bi bi-pencil-fill me-2"></i>Edit Class</p>
            </button>
          </div>
        </div>

        </div>
</template>

<script>
import { Auth } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { Classes } from '../models';
import { User } from '../models';
import { useToast } from "vue-toastification";

export default {
    name: 'NavbarAuth',
    setup() {
        const toast = useToast();
        return { toast }
    },
    components: {
      // Class
    },
    data() {
      return {
        classData: {},

        className: '',
        classCode: '',
        classDesc: '',

        editClassName: '',
        editClassCode: '',
        editClassDesc: '',
        editClassId: '',

        userName: '',
        userRole: '',
        userId: '',

        isAssigningParticipant: false,
        selectedClassNameParticipants: '',
        studentList: {},
        participantList: [],

        isSettingSchedule: false,
        selectedClassNameSchedule: '',
        scheduleList: {},

        mondayTime: '',
        mondayLocation: '',
        mondayType: 'Lecture',

        tuesdayTime: '',
        tuesdayLocation: '',
        tuesdayType: 'Lecture',

        wednesdayTime: '',
        wednesdayLocation: '',
        wednesdayType: 'Lecture',

        thursdayTime: '',
        thursdayLocation: '',
        thursdayType: 'Lecture',

        fridayTime: '',
        fridayLocation: '',
        fridayType: 'Lecture',

        disableAddClass: true,

        // monday: {time: '', location: '', type: 'lecture'},
        // tuesday: {'time': '', 'location': '', 'type': 'lecture'},
        // wednesday: {'time': '', 'location': '', 'type': 'lecture'},
        // thursday: {'time': '', 'location': '', 'type': 'lecture'},
        // friday: {'time': '', 'location': '', 'type': 'lecture'},
      }
    },
    methods: {
        async queryClass() {
            const models = await DataStore.query(Classes, c => c.userid.contains(this.userId));
            this.classData = models
        },

        async createClass() {
            await DataStore.save(
                new Classes({
                    "userid": this.userId,
                    "data":  {
                        'name': this.className,
                        'code': this.classCode,
                        'createdBy': this.userName,
                        'description': this.classDesc,
                        'schedule': {
                          'mon': {'time': '', 'location': '', 'type': 'Lecture'},
                          'tue': {'time': '', 'location': '', 'type': 'Lecture'},
                          'wed': {'time': '', 'location': '', 'type': 'Lecture'},
                          'thu': {'time': '', 'location': '', 'type': 'Lecture'},
                          'fri': {'time': '', 'location': '', 'type': 'Lecture'},
                        }
                    },
                    "participants": []
                })
            );

            
            this.toast.success('Class created successfully.')

            this.queryClass();
            this.$emit('queryClass')
            
            this.className = ''
            this.classCode = ''
            this.classDesc = ''
        },

        selectEditClass(id, data) {
          this.editClassName = data.name
          this.editClassCode = data.code
          this.editClassDesc = data.description
          this.editClassId = id
        },

        async editClass() {
          const original = await DataStore.query(Classes, this.editClassId)
          console.log(original)
          await DataStore.save(Classes.copyOf(original, item => {
              item.data = {
                'name': this.editClassName,
                'code': this.editClassCode,
                'description': this.editClassDesc
              }
          }));

          this.toast.success('Class edited successfully.')
          
          this.queryClass();
          this.$emit('queryClass')
        },

        async deleteClass(id) {
            const modelToDelete = await DataStore.query(Classes, id);
            DataStore.delete(modelToDelete);
            
            this.toast.success('Class deleted successfully.')

            this.queryClass();
            this.$emit('queryClass')
        },

        async logoutUser() {
          try {
              await Auth.signOut();
              this.$router.push({ name: 'login'})
          } catch (error) {
              console.log('error signing out: ', error);
              this.toast.error('Error signing out.')
          }
        },

        showAssignParticipant(classid, participants, classname) {
          this.isAssigningParticipant = true
          this.editClassId = classid
          this.selectedClassNameParticipants = classname
          this.participantList = participants
          this.queryStudent()
        },

        showSetSchedule(classid, schedule, classname) {
          console.log(schedule)

          if (!schedule) {
            schedule = {
              'mon': {'time': '', 'location': '', 'type': 'Lecture'},
              'tue': {'time': '', 'location': '', 'type': 'Lecture'},
              'wed': {'time': '', 'location': '', 'type': 'Lecture'},
              'thu': {'time': '', 'location': '', 'type': 'Lecture'},
              'fri': {'time': '', 'location': '', 'type': 'Lecture'},
            }
          }

          this.isSettingSchedule = true
          this.editClassId = classid

          this.mondayTime = schedule.mon.time
          this.mondayLocation = schedule.mon.location
          this.mondayType = schedule.mon.type

          this.tuesdayTime = schedule.tue.time
          this.tuesdayLocation = schedule.tue.location
          this.tuesdayType = schedule.tue.type

          this.wednesdayTime = schedule.wed.time
          this.wednesdayLocation = schedule.wed.location
          this.wednesdayType = schedule.wed.type

          this.thursdayTime = schedule.thu.time
          this.thursdayLocation = schedule.thu.location
          this.thursdayType = schedule.thu.type

          this.fridayTime = schedule.fri.time
          this.fridayLocation = schedule.fri.location
          this.fridayType = schedule.fri.type

          this.selectedClassNameSchedule = classname

          this.queryClass();
        },
        
        async queryStudent() {
            const models = await DataStore.query(User, c => c.role.contains('student'));
            console.log(models)
  
            this.studentList = models
        },

        async assignParticipants() {
          console.log('participantList', this.participantList)
          console.log(this.editClassId)
          const original = await DataStore.query(Classes, this.editClassId)
          console.log(original)
          await DataStore.save(Classes.copyOf(original, item => {
              item.participants = []
              this.participantList.forEach(obj => {
                item.participants.push(obj)
              })
          }));
          this.toast.success('Participants assigned successfully.')
          await this.queryClass();
          this.$emit('queryClass')
        },       

        async setSchedule() {
          console.log('participantList', this.participantList)
          console.log(this.editClassId)
          const scheduleData = {
            'mon': {
              'time': this.mondayTime,
              'location': this.mondayLocation,
              'type': this.mondayType,
            },
            'tue': {
              'time': this.tuesdayTime,
              'location': this.tuesdayLocation,
              'type': this.tuesdayType,
            },
            'wed': {
              'time': this.wednesdayTime,
              'location': this.wednesdayLocation,
              'type': this.wednesdayType,
            },
            'thu': {
              'time': this.thursdayTime,
              'location': this.thursdayLocation,
              'type': this.thursdayType,
            },
            'fri': {
              'time': this.fridayTime,
              'location': this.fridayLocation,
              'type': this.fridayType,
            },
          }
          const original = await DataStore.query(Classes, this.editClassId)
          console.log(scheduleData)
          await DataStore.save(Classes.copyOf(original, item => {
              item.data.schedule = scheduleData
          }));
          this.toast.success('Schedule set successfully.')
          await this.queryClass();
          this.$emit('queryClass')
        }, 

        validateAddClass() {
          this.disableAddClass = (this.className == '' || this.classCode == '')
        }
    },
    async mounted() {
        if (JSON.parse(localStorage.getItem("userData")).userAttributes)
          this.userName = JSON.parse(localStorage.getItem("userData")).userAttributes.name
        else
          this.userName = JSON.parse(localStorage.getItem("userData")).name

        this.userId = localStorage.getItem("userId")
        this.userRole = localStorage.getItem("userRole")

        console.log(this.userName, this.userRole, this.userId)
        await this.queryClass();
    }
}
</script>

<style>

</style>