<template>
  <div class="card p-3 text-start w-50 mx-auto">
    <div v-show="!isSignup">
        <form>
            <div class="mb-3">
                <label for="exampleInputEmail1" class="form-label">Email address</label>
                <input v-model="username" type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp">
                <div v-show="false" id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
                <label for="exampleInputPassword1" class="form-label">Password</label>
                <input v-model="password" type="password" class="form-control" id="exampleInputPassword1">
            </div>
            <div class="mb-3">
                <a @click="toggleSignInUp()" class="btn btn-link" for="exampleCheck1">Don't have an account? Signup</a>
            </div>
            <button @click="loginUser($event)" class="btn btn-primary" :disabled="username == '' || password == ''">Login</button>
        </form>
    </div>

    <div v-show="isSignup && !isConfirm">
        <form>
            <div class="mb-3">
                <label for="signupEmail" class="form-label">Email address <span class="text-danger">*</span></label>
                <input v-model="signupEmail" type="email" class="form-control" id="signupEmail" aria-describedby="emailHelp">
                <div v-show="false" id="emailHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
                <label for="signupName" class="form-label">Name <span class="text-danger">*</span></label>
                <input v-model="signupName" type="email" class="form-control" id="signupName" aria-describedby="nameHelp">
                <div v-show="false" id="nameHelp" class="form-text">We'll never share your email with anyone else.</div>
            </div>
            <div class="mb-3">
                <label for="signupPassword" class="form-label">Password <span class="text-danger">*</span></label>
                <input v-model="signupPassword" type="password" class="form-control" id="signupPassword">
            </div>
            <div class="mb-3">
                <label for="signupConfirmPassword" class="form-label">Confirm Password <span class="text-danger">*</span></label>
                <input v-model="signupConfirmPassword" type="password" class="form-control" id="signupConfirmPassword">
            </div>
            <div class="mb-3 form-check">
                <input v-model="isTeacher" true-value="teacher" false-value="student" class="form-check-input" type="checkbox" value="" id="isTeacher">
                <label class="form-check-label" for="isTeacher">
                    Teacher
                </label>
            </div>
            <div class="mb-3">
                <a @click="toggleSignInUp()" class="btn btn-link" for="exampleCheck1">Already have an account? Login</a>
            </div>
            <button @click="signupUser($event)" class="btn btn-primary" :disabled="signupEmail == '' || signupPassword == '' || signupConfirmPassword != signupPassword || signupName == ''">Signup</button>
        </form>
    </div>

    <div v-show="isSignup && isConfirm">
        <form>
            <div class="mb-3">
                <p>A verification code has been sent to your email.</p>
            </div>
            <div class="mb-3">
                <input v-model="verificationCode" type="email" class="form-control" id="verificationCode" aria-describedby="resendCode">
                <div id="resendCode" class="form-text">
                    <a @click="resendConfirmationCode()" class="btn btn-link">
                        Didn't receive your code? Resend
                    </a>
                </div>
            </div>
            <button @click="confirmSignUp($event)" class="btn btn-primary">Confirm</button>
        </form>
    </div>

    <!-- <div class="position-fixed top-0 end-0 p-3" style="z-index: 11">
        <div v-vb-is:toast ref="toast1" class="toast align-items-center text-bg-danger border-0" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body" id="toastbody">
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
            </div>
        </div>
    </div> -->
  </div>
</template>

<script>
import { Auth, Hub } from 'aws-amplify';
import { DataStore } from '@aws-amplify/datastore';
import { User } from '../models';
import { useToast } from "vue-toastification";

export default {
    name: 'LoginPage',
    setup() {
        const toast = useToast();
        return { toast }
    },
    data() {
        return {
            userData: {},

            username: '',
            password: '',

            signupEmail: '',
            signupName: '',
            signupPassword: '',
            signupConfirmPassword: '',
            isTeacher: 'student',

            verificationCode: '',

            isSignup: false,
            isConfirm: false,
        }
    },
    methods: {
        async loginUser(e) {
            try {
                e.preventDefault()
                const user = await Auth.signIn(this.username, this.password);
                console.log('user', user)
                if (user.challengeParam)
                    localStorage.setItem("userData", JSON.stringify(user.challengeParam));
                else 
                    localStorage.setItem("userData", JSON.stringify(user.attributes));
                this.$userData = user
                await this.queryUser(this.username)
                // console.log(JSON.parse(localStorage.getItem("userData")))
                // this.$emit('authenticated', user)
                if (typeof user !== 'string')
                    this.$router.push({ name: 'classes'})
            } catch (error) {
                console.log('error signing in', error);
                if (error == 'NotAuthorizedException: Incorrect username or password.')
                    this.toast.error('Incorrect username or password.')
                else if (error == 'UserNotFoundException: User does not exist.')
                    this.toast.error('User does not exist.')
                else
                    this.toast.error('An error occured while signing in.')
            }
        },

        async signupUser(e) {
            try {
                e.preventDefault()
                if (this.validateSignup()) {
                    const { user } = await Auth.signUp({
                        username: this.signupEmail,
                        password: this.signupPassword,
                        attributes: {
                            'name': this.signupName,        
                        },
                        autoSignIn: { // optional - enables auto sign in after user is confirmed
                            enabled: true,
                        }
                    });
                    console.log('signup', user);
                    if (typeof user !== 'string') {
                        this.createUser()
                        this.isConfirm = true
                    }
                } else {
                    alert('Check if credentials are complete')
                }
            } catch (error) {
                console.log('error signing up:', error);
                if (error.name.includes(`InvalidParameterException`))
                    this.toast.error('Password should contain lowercase characters, numbers and 8 characters long.', { timeout: 4000 })
                else if (error == 'UsernameExistsException: An account with the given email already exists.')
                    this.toast.error('An account with the given email already exists.')
                else
                    this.toast.error('An error occured while signing up.')
            }
        },

        async createUser() {
            await DataStore.save(
                new User({
                    "role": this.isTeacher,
                    "data":  {
                        'name': this.signupName,
                        'email': this.signupEmail,
                    },
                })
            );
        },
        
        async queryUser(email) {
            const models = await DataStore.query(User);
            console.log(models)

            models.forEach(obj => {
                if (obj.data.email == email) {
                    localStorage.setItem("userId", obj.id);
                    localStorage.setItem("userRole", obj.role);
                }
            })
        },

        async resendConfirmationCode() {
            try {
                await Auth.resendSignUp(this.signupEmail);
                console.log('code resent successfully');
            } catch (err) {
                console.log('error resending code: ', err);
            }
        },

        listenToAutoSignInEvent() {
            try {
                Hub.listen('auth', async ({ payload }) => {
                    const { event } = payload;
                    if (event === 'autoSignIn') {
                        const user = payload.data;
                        console.log('wee', user)
                        localStorage.setItem("userData", JSON.stringify(user.attributes));
                        this.$userData = user
                        console.log('ree', JSON.parse(localStorage.getItem("userData")))
                        await this.queryUser(this.signupEmail)
                        if (typeof user !== 'string')
                            this.$router.push({ name: 'classes'})
                        else 
                            alert(user)
                    } else if (event === 'autoSignIn_failure') {
                        this.isSignup = false
                        this.isConfirm = false
                    }
                })
            } catch (error) {
                this.toast.error('An error occured while signing in.')
            }
        },

        async confirmSignUp(e) {
            try {
                e.preventDefault()
                await Auth.confirmSignUp(this.signupEmail, this.verificationCode);
                this.listenToAutoSignInEvent()
            } catch (error) {
                console.log('error confirming sign up', error);
            }
        },

        toggleSignInUp() {
            this.isSignup = !this.isSignup
        },

        validateSignup() {
            const isEmailEmpty = this.signupEmail == ''
            const isPasswordEmpty = this.signupPassword == ''
            const isPasswordConfirmed = this.signupPassword == this.signupConfirmPassword
            return !isEmailEmpty && !isPasswordEmpty && isPasswordConfirmed
        }
    }
}
</script>

<style>

</style>