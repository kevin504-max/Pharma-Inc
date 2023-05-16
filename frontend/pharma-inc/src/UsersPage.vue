<template>
    <main>
        <HeaderPage />
        <b-card class="login-card shadow bg-white rounded">
            <loading :active.sync="isLoading" :can-canel="false" :is-full-page="fullPage"></loading>
            <b-card-body class="bg-white">
                <CustomCard></CustomCard>
                <b-form-group 
                    v-model="sort"
                    label="" 
                    label-cols="0" 
                    label-align="center" 
                    label-size="md" 
                    class="search-filter mt-2" 
                    v-slot="{ ariaDescribedby }"
                >
                    <b-form-radio-group
                        v-model="selected"
                        :aria-describedby="ariaDescribedby"
                        class="mt-3"
                    >
                        <b-form-radio
                            value="username"
                            v-b-tooltip.hover
                            title="Filtrar por nome"
                            class="mr-2 radio"
                        >Usuário</b-form-radio>
                        <b-form-radio
                            value="nationality"
                            v-b-tooltip.hover
                            title="Filtrar por nacionalidade"
                            class="mr-2 radio"
                        >Nacionalidade</b-form-radio>
                    </b-form-radio-group>
                </b-form-group>
                <DataFilter @onUpdatedFilterSearch="updatedFilterSearch($event)"></DataFilter>
                <div>
                    <b-table 
                        striped
                        :fields="fields"
                        :items="resultedUsers"
                        @filtered="updatedFilter"
                        :per-page="perPage"
                        :current-page="currentPage"
                        stacked="md"
                    >
                        <template v-slot:cell(update)="row">
                            <img class="item-table mr-2" :src="editIcon" @click="openModal(row.item, row.index, $event.target)" style="cursor: pointer;" />
                            <img class="item-table" :src="deleteIcon" @click="openDeleteModal(row.item, row.index, $event.target)" style="cursor: pointer;" />
                        </template>
                    </b-table>
                    <b-col sm="8" md="6" class="my-1">
                        <b-pagination
                            v-model="currentPage"
                            :total-rows="totalRows"
                            :per-page="perPage"
                            v-if="totalRows > 2"
                            align="fill"
                            size="sm"
                            class="my-0"
                        ></b-pagination>
                    </b-col>
                    <b-modal id="modalDetailsUpdate" ref="modalDetailsUpdate" size="lg" hide-footer>
                        <b-card
                            class="modal-body"
                            bg-variant="light"
                            text-variant="dark"
                        >
                            <div class="image-container">
                                <b-img
                                    :src="user.userImage"
                                    rounded="circle"
                                    alt="user image"
                                    center
                                    size="lg"
                                    thumbnail
                                    fluid-grow
                                    style="width: 30% !important;"
                                ></b-img>
                            </div>
                            <b-card-body>
                                <b-form>
                                    <b-row>
                                        <b-col v-show="!updateUserState">
                                            <b-form-group
                                                label="Nome completo"
                                                label-for="user-fullname-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-input 
                                                    id="user-fullname-input"
                                                    v-model="user.fullName"
                                                    class="form-control border border-dark"
                                                    :readonly="!updateUserState"
                                                ></b-form-input>
                                            </b-form-group>
                                        </b-col>
                                        <b-col v-show="updateUserState">
                                            <b-form-group
                                                label="Pronomes"
                                                label-for="user-title-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-input
                                                    id="user-title-input"
                                                    v-model="user.name.title"
                                                    class="form-control border border-dark"
                                                    :class="{'is-invalid': submitted && $v.user.name.title.$error}"
                                                ></b-form-input>
                                                <div class="invalid" v-show="submitted && $v.user.name.title.$error">
                                                    <span v-show="!$v.user.name.title.required">Por favor informe um pronome.</span>
                                                </div>
                                            </b-form-group>
                                        </b-col>
                                        <b-col v-show="updateUserState">
                                            <b-form-group
                                                label="Nome"
                                                label-for="user-firstname-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-input 
                                                    id="user-firstname-input"
                                                    v-model="user.name.first"
                                                    class="form-control border border-dark"
                                                    :class="{'is-invalid': submitted && $v.user.name.first.$error}"
                                                ></b-form-input>
                                                <div class="invalid" v-show="submitted && $v.user.name.first.$error">
                                                    <span v-show="!$v.user.name.first.required">Por favor informe um nome.</span>
                                                    <span v-show="!$v.user.name.first.minLength">O nome deve ter no mínimo 3 caracteres.</span>
                                                </div>
                                            </b-form-group>
                                        </b-col>
                                        <b-col v-show="updateUserState">
                                            <b-form-group
                                                label="Sobrenome"
                                                label-for="user-lastname-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-input
                                                    id="user-lastname-input"
                                                    v-model="user.name.last"
                                                    class="form-control border border-dark"
                                                    :class="{'is-invalid': submitted && $v.user.name.last.$error}"
                                                ></b-form-input>
                                                <div class="invalid" v-show="submitted && $v.user.name.last.$error">
                                                    <span v-show="!$v.user.name.last.required">Por favor informe um sobrenome.</span>
                                                    <span v-show="!$v.user.name.last.minLength">O sobrenome deve ter no mínimo 3 caracteres.</span>
                                                </div>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col>
                                            <b-form-group
                                                label="E-mail"
                                                label-for="user-email-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-input
                                                    id="user-email-input"
                                                    v-model="user.email"
                                                    class="form-control border border-dark"
                                                    :class="{'is-invalid': submitted && $v.user.email.$error}"
                                                    :readonly="!updateUserState"
                                                ></b-form-input>
                                                <div class="invalid" v-show="submitted && $v.user.email.$error">
                                                    <span v-show="!$v.user.email.required">Por favor informe um e-mail.</span>
                                                    <span v-show="!$v.user.email.email">Por favor informe um e-mail válido (pharmainc@gmail.com).</span>
                                                </div>
                                            </b-form-group>
                                        </b-col>
                                        <b-col>
                                            <b-form-group
                                                label="Gênero"
                                                label-for="user-gender-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-select
                                                    v-show="updateUserState"
                                                    v-model="user.gender"
                                                    :options="genders"
                                                    class="form-control border border-dark"
                                                ></b-form-select>
                                                <b-form-input
                                                    v-show="!updateUserState"
                                                    id="user-gender-input"
                                                    v-model="user.gender"
                                                    :readonly="!updateUserState"
                                                ></b-form-input>
                                            </b-form-group>
                                        </b-col>
                                        <b-col class="col-3">
                                            <b-form-group 
                                                label="Nacionalidade"
                                                label-for="user-nationality-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-select
                                                    v-show="updateUserState"
                                                    v-model="user.nationality"
                                                    :options="nationalities"
                                                    class="form-control border border-dark"
                                                ></b-form-select>
                                                <b-form-input
                                                    v-show="!updateUserState"
                                                    id="user-nationality-input"
                                                    v-model="user.nationality"
                                                    :readonly="!updateUserState"
                                                ></b-form-input>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col>
                                            <b-form-group
                                                label="Data de nascimento"
                                                label-for="user-birthdate-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-input 
                                                    id="user-birthdate-input"
                                                    v-model="user.birth"
                                                    class="form-control border border-dark"
                                                    :class="{'is-invalid': submitted && $v.user.birth.$error}"
                                                    :readonly="!updateUserState"
                                                ></b-form-input>
                                                <div class="invalid" v-show="submitted && $v.user.birth.$error">
                                                    <span v-show="!$v.user.birth.required">Por favor informe uma data de nascimento.</span>
                                                    <span v-show="!$v.user.birth.dateValidator">Por favor informe uma data com formato válido.</span>
                                                </div>
                                            </b-form-group>
                                        </b-col>
                                        <b-col>
                                            <b-form-group
                                                label="Telefone"
                                                label-for="user-phone-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-input
                                                    id="user-phone-input"
                                                    @keypress="checkNumber($event)"
                                                    v-model="user.phone"
                                                    class="form-control border border-dark"
                                                    :class="{'is-invalid': submitted && $v.user.phone.$error}"
                                                    :readonly="!updateUserState"
                                                ></b-form-input>
                                                <div class="invalid" v-show="submitted && $v.user.phone.$error">
                                                    <span v-show="!$v.user.phone.required">Por favor informe um telefone.</span>
                                                </div>
                                            </b-form-group>
                                        </b-col>
                                        <b-col>
                                            <b-form-group
                                                label="ID"
                                                label-for="user-id-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-input
                                                    id="user-id-input"
                                                    v-model="user.id.value"
                                                    class="form-control border border-dark"
                                                    :class="{'is-invalid': submitted && $v.user.id.value.$error}"
                                                    :readonly="!updateUserState"
                                                ></b-form-input>
                                                <div class="invalid" v-show="submitted && $v.user.id.value.$error">
                                                    <span v-show="!$v.user.id.value.required">Por favor informe um valor ID.</span>
                                                </div>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col v-show="!updateUserState">
                                            <b-form-group
                                                label="Endereço"
                                                label-for="user-address-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-input
                                                    id="user-address-input"
                                                    v-model="user.address"
                                                    class="form-control border border-dark"
                                                    :readonly="!updateUserState"
                                                ></b-form-input>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col v-show="updateUserState">
                                            <b-form-group
                                                label="Rua"
                                                label-for="user-location-street-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-input
                                                    id="user-location-street-input"
                                                    v-model="user.location.street.name"
                                                    class="form-control border border-dark"
                                                    :class="{'is-invalid': submitted && $v.user.location.street.name.$error}"
                                                ></b-form-input>
                                                <div class="invalid" v-show="submitted && $v.user.location.street.name.$error">
                                                    <span v-show="!$v.user.location.street.name.required">Por favor informe uma rua.</span>
                                                    <span v-show="!$v.user.location.street.name.minLength">Por favor informe uma rua com no mínimo 3 caracteres.</span>
                                                </div>
                                            </b-form-group>
                                        </b-col>
                                        <b-col class="col-2" v-show="updateUserState">
                                            <b-form-group
                                                label="Número"
                                                label-for="user-location-number-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-input
                                                    id="user-location-number-input"
                                                    @keypress="checkNumber($event)"
                                                    v-model="user.location.street.number"
                                                    class="form-control border border-dark"
                                                    :class="{'is-invalid': submitted && $v.user.location.street.number.$error}"
                                                ></b-form-input>
                                                <div class="invalid" v-show="submitted && $v.user.location.street.number.$error">
                                                    <span v-show="!$v.user.location.street.number.required">Por favor informe um número.</span>
                                                </div>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                    <b-row>
                                        <b-col v-show="updateUserState">
                                            <b-form-group
                                                label="Estado"
                                                label-for="user-location-state-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-input
                                                    id="user-location-state-input"
                                                    v-model="user.location.state"
                                                    class="form-control border border-dark"
                                                    :class="{'is-invalid': submitted && $v.user.location.state.$error}"
                                                ></b-form-input>
                                                <div class="invalid" v-show="submitted && $v.user.location.state.$error">
                                                    <span v-show="!$v.user.location.state.required">Por favor informe um estado.</span>
                                                    <span v-show="!$v.user.location.state.minLength">Por favor informe um estado com no mínimo 3 caracteres.</span>
                                                </div>
                                            </b-form-group>
                                        </b-col>
                                        <b-col v-show="updateUserState">
                                            <b-form-group
                                                label="Cidade"
                                                label-for="user-location-city-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-input
                                                    id="user-location-city-input"
                                                    v-model="user.location.city"
                                                    class="form-control border border-dark"
                                                    :class="{'is-invalid': submitted && $v.user.location.city.$error}"
                                                ></b-form-input>
                                                <div class="invalid" v-show="submitted && $v.user.location.city.$error">
                                                    <span v-show="!$v.user.location.city.required">Por favor informe uma cidade.</span>
                                                    <span v-show="!$v.user.location.city.minLength">Por favor informe uma cidade com no mínimo 3 caracteres.</span>
                                                </div>
                                            </b-form-group>
                                        </b-col>
                                        <b-col v-show="updateUserState">
                                            <b-form-group
                                                label="País"
                                                label-for="user-location-country-input"
                                                label-class="font-weight-bold pt-10"
                                            >
                                                <b-form-select
                                                    v-show="updateUserState"
                                                    id="user-location-country-input"
                                                    v-model="user.location.country"
                                                    :options="countries"
                                                    class="form-control border border-dark"
                                                    :class="{'is-invalid': submitted && $v.user.location.country.$error}"
                                                ></b-form-select>
                                                <div class="invalid" v-show="submitted && $v.user.location.country.$error">
                                                    <span v-show="!$v.user.location.country.required">Por favor informe um país.</span>
                                                </div>
                                            </b-form-group>
                                        </b-col>
                                    </b-row>
                                </b-form>
                                <b-row v-show="!updateUserState">
                                    <b-col class="p-3 mt-5">
                                        <b-button
                                            @click="allowUserUpdate()"
                                            class="align-self-end float-right"
                                            variant="info"
                                        >Atualizar Dados</b-button>
                                        <b-button
                                            @click="hideModal()"
                                            class="align-self-end float-right mr-2"
                                            variant="white"
                                        >Fechar</b-button>
                                    </b-col>
                                </b-row>
                                <b-row v-show="updateUserState">
                                    <b-col class="p-3 mt-5">
                                        <b-button
                                            @click="handleSubmit"
                                            class="align-self-end float-right"
                                            variant="info"
                                        >Salvar</b-button>
                                        <b-button
                                            @click="cancelUserUpdate()"
                                            class="align-self-end float-right mr-2"
                                            variant="white"
                                        >Cancelar</b-button>
                                    </b-col>
                                </b-row>
                            </b-card-body>
                        </b-card>
                    </b-modal>
                    <b-modal id="modalDeleteUser" ref="modalDeleteUser" size="md" hide-footer>
                        <b-modal-body 
                            class="modal-body"
                            bg-variant="light"
                            text-variant="dark"
                        >
                            <h4 class="text-center">Tem certeza que deseja <strong>remover</strong> este usuário?</h4>
                        </b-modal-body>
                        <b-modal-footer>
                            <div class="border-top mt-3 mb-3"></div>
                            <b-button
                                @click="removeUser(user.userId)"
                                class="align-self-end float-right mt-2"
                                variant="danger"
                            >Remover</b-button>
                        </b-modal-footer>
                    </b-modal>
                </div>
            </b-card-body>
        </b-card>
    </main>
</template>

<script>
import Loading from 'vue-loading-overlay';
import "vue-loading-overlay/dist/vue-loading.css";
import doneIcon from "@/assets/icons/done_black_24dp.svg";
import errorIcon from "@/assets/icons/error_black_24dp.svg";
import plusIcon from "@/assets/icons/2000.svg";
import editIcon from "@/assets/icons/pencil.svg";
import deleteIcon from "@/assets/icons/delete.svg";
import timeIcon from "@/assets/icons/timelapse_black_24dp.svg";
import moment from "moment";
import {
    required,
    email,
    minLength,
    numeric
} from "vuelidate/lib/validators";
import { dateValidator } from "@/services/dateValidator";
import { userService } from "@/services/userService";
import { usersHelpers } from "@/services/usersHelpers";
import HeaderPage from "@/components/layouts/HeaderPage.vue"
import CustomCard from "@/components/CustomCard.vue"
import DataFilter from "@/components/DataFilter.vue"

export default {
    name: 'UsersPage',
    components: {   
        Loading,
        HeaderPage,
        CustomCard,
        DataFilter
    },
    data() {
        return {
            doneIcon,
            errorIcon,
            plusIcon,
            editIcon,
            deleteIcon,
            timeIcon,
            selected: "username",
            sort: "ASC",
            genders: [
                { value: "Masculino", text: "Masculino" },
                { value: "Feminino", text: "Feminino" },
                { value: "Outro", text: "Outro" },
            ],
            filterSearch: "",
            submitted: false,
            updateUserState: false,
            nationalities: [],
            countries: [],
            users: [],
            user: {
                name: {
                    title: "",
                    first: "",
                    last: ""
                },
                location: {
                    street: {
                        number: "",
                        name: ""
                    },
                    city: "",
                    country: "",
                },
                fullName: "",
                userImage: "",
                birth: "",
                gender: null,
                phone: "",
                nat: "",
                address: "",
                id: {
                    value: "",
                },
                userId: "",
                email: "",
                nationality: ""
            },
            fields: [
                { key: "fullName", label: "Nome", sortable: true },
                { key: "gender", label: "Gênero" },
                {
                    key: "birthday",
                    label: "Aniversário",
                    thStyle: { width: "200px" },
                },
                {
                    key: "update",
                    label: "Atualizar",
                    sortable: false,
                    thStyle: { width: "100px" },
                }
            ],
            isLoading: false,
            fullPage: true,
            timer: "",
            refreshTimer: 20000,
            totalRows: 1,
            perPage: 21,
            currentPage: 1
        };
    },
    computed: {
        resultedUsers: function () {
            this.renameBirthdayWithoutYear();
            this.setFullName();

            return this.users.filter((user) => {
                if ((this.selected === "nationality") && (this.filterSearch.length > 1)) {
                    return user.nat.includes(this.filterSearch) ||
                        user.nat.toLowerCase().includes(this.filterSearch) ||
                        user.nat.toUpperCase().includes(this.filterSearch);
                } else if ((this.selected === "username") && (this.filterSearch.length > 3)) {
                    return user.fullName.includes(this.filterSearch) || 
                        user.fullName.toLowerCase().includes(this.filterSearch) ||
                        user.fullName.toUpperCase().includes(this.filterSearch);
                } else {
                    return user;
                }
            });
        },
    },
    async created() {

    },
    async mounted() {
        this.isLoading = true;
        this.users = await userService.getUsers();
        this.nationalities = await usersHelpers.getNationalities();
        this.countries = await usersHelpers.getCountries();
        this.totalRows = this.users.length;
        this.isLoading = false;
    },
    methods: {
        updatedFilter(filteredItems) {
            this.totalRows = filteredItems.length;
            this.currentPage = 1;
        },

        updatedFilterSearch(event) {
            this.filterSearch = event;
        },

        checkNumber(event) {
            const keyCode = event.wich || event.keyCode;

            if(keyCode > 31 && (keyCode < 48 || keyCode > 57) && keyCode !== 46) {
                event.preventDefault();
            }
        },

        format2databr(date) {
            return moment(date).format("DD/MM/YYYY");
        },

        openModal(user) {
            this.$refs.modalDetailsUpdate.title = "Informações do Usuário";
            this.setModalData(user);
            this.$refs.modalDetailsUpdate.show();
        },  

        setModalData(user) {
            this.user.userId = user.userId;
            this.user.userImage = user.picture.large;
            this.user.fullName = user.fullName;
            this.user.email = user.email;
            this.user.gender = user.gender;
            this.user.birth = this.format2databr(user.dob.date);
            this.user.phone = user.phone;
            this.user.nationality = user.nat;
            this.user.address = `
                ${user.location.street.name} - ${String(user.location.street.number)},
                ${user.location.city} - ${user.location.state} - ${user.location.country}
            `;
            this.user.id.value = user.id.value;
        },

        openDeleteModal(user) {
            this.$refs.modalDeleteUser.title = "Remover Usuário";
            this.user = user;
            this.$refs.modalDeleteUser.show();
        },

        async handleSubmit() {
            try {
                this.submitted = true;
                this.$v.$touch();
    
                if (this.$v.$invalid) {
                    return;
                } else {
                    this.submitted = true;
                    this.isLoading = true;
                    await userService.updateUser(this.user);
                    this.$toast.open("Usuário atualizado com sucesso!");
                    this.users = await userService.getUsers();
                    this.isLoading = false;
                    this.updateUserState = false;
                    this.$nextTick(() => {
                        this.$refs.modal.hide();
                    });
                }
            } catch (error) {
                this.$toast.open("Erro ao atualizar usuário!");
                this.isLoading = false;
            }
        },  

        async removeUser(userId) {
            this.isLoading = true;
            
            try {
                await userService.removeUser(parseInt(userId));
                this.users = await userService.getUsers();
                this.isLoading = false;
                this.$refs.modalDeleteUser.hide();
                this.$toast.open("Usuário removido com sucesso!");
            } catch (error) {
                this.$toast.open("Erro ao remover usuário!");
                this.isLoading = false;    
            }
        },

        renameBirthdayWithoutYear: function () {
            this.users.forEach((user) => {
                user.birthday = moment(user.dob.date).format("DD/MM");
            });
        },
    
        setFullName: function () {
            this.users.forEach((user) => {
                user.fullName = `${user.name.title} ${user.name.first} ${user.name.last}`;
            });
        },

        allowUserUpdate() {
            this.updateUserState = !this.updateUserState;
        },

        cancelUserUpdate() {
            this.allowUserUpdate();
            this.submitted = false;
        },

        hideModal() {
            this.$refs.modalDetailsUpdate.hide();
        }
    },
    validations: {
        user: {
            name: {
                title: { required },
                first: { 
                    required,
                    minLength: minLength(3)
                },
                last: { 
                    required,
                    minLength: minLength(3)
                }
            },
            location: {
                street: {
                    name: {
                        required,
                        minLength: minLength(3)
                    },
                    number: {
                        required,
                        minLength: minLength(3)
                    },
                },
                state: {
                    required,
                    minLength: minLength(3)
                },
                city: {
                    required,
                    minLength: minLength(3)
                },
                country: { required }                
            },
            email: { required, email },
            birth: { required, dateValidator },
            phone: { required, numeric },
            id: { value: { required } }
        }
    }
};
</script>

<style scope>
.invalid {
    color: red;
    font-size: 0.8rem;
}

.align-self-end {
    align-self: flex-end;
}
</style>