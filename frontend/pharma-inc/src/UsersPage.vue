<template>
    <HeaderPage />
    <b-card class="shadow bg-light">
        <loading :active="isLoading" :can-canel="false" :is-full-page="fullPage"></loading>
        <b-card-body>
            <CustomCard></CustomCard>
            <b-form-group 
                v-model="sort"
                label="" 
                label-cols="0" 
                label-align="center" 
                label-size="md" 
                class="search-filter" 
                v-slot="{ ariaDescribedby }"
            >
                <b-form-radio-group
                    v-model="selected"
                    :aria-describedby="ariaDescribedby"
                    class="mt-1"
                >
                    <b-form-radio
                        value="username"
                        v-b-tooltip.hover
                        title="Filtrar por nome"
                    >Usuário</b-form-radio>
                    <b-form-radio
                        value="nationality"
                        v-b-tooltip.hover
                        title="Filtrar por nacionalidade"
                    >Nacionalidade</b-form-radio>
                </b-form-radio-group>
            </b-form-group>
            <DataFilter></DataFilter>
            <div>
                <b-table 
                    striped
                    :fields="fields"
                    :items="filteredUsers"
                    @filtered="onFiltered"
                    :per-page="perPage"
                    :current-page="currentPage"
                    stacked="md"
                >
                    <template v-slot:cell(edit)="row">
                        <img class="item-table" :src="faPen" @click="openModal(row.item, row.index, $event.target)" />
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
                <b-modal id="modalPreventClose" ref="modal" size="lg" hide-footer>
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
                                width="30%"   
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
                                    <b-col v-show="udpateUserState">
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
                                            <b-form-input
                                                id="user-location-country-input"
                                                v-model="user.location.country"
                                                class="form-control border border-dark"
                                                :class="{'is-invalid': submitted && $v.user.location.country.$error}"
                                            ></b-form-input>
                                            <div class="invalid" v-show="submitted && $v.user.location.country.$error">
                                                <span v-show="!$v.user.location.country.required">Por favor informe um país.</span>
                                            </div>
                                        </b-form-group>
                                    </b-col>
                                </b-row>
                            </b-form>
                            <b-row v-show="updateUserState">
                                <b-col>
                                    <b-button
                                        @click="allowUserUpdate()"
                                        class="align-self-end"
                                        variant="success"
                                    >Atualizar Dados</b-button>
                                    <b-button
                                        @click="hideModal()"
                                        class="align-self-end"
                                        variant="danger"
                                    >Fechar</b-button>
                                </b-col>
                            </b-row>
                            <b-row v-show="updateUserState">
                                <b-col>
                                    <b-button
                                        @click="handleSubmit"
                                        class="align-self-end"
                                        variant="success"
                                    >Salvar</b-button>
                                    <b-button
                                        @click="cancelUserUpdate()"
                                        class="align-self-end"
                                        variant="danger"
                                    >Cancelar</b-button>
                                </b-col>
                            </b-row>
                        </b-card-body>
                    </b-card>
                </b-modal>
            </div>
        </b-card-body>
    </b-card>
</template>

<script>
import Loading from 'vue-loading-overlay';
import { 
    faSquareCheck,
    faFlagUsa,
    faPlus,
    faPen,
    faTrash,
    faClock 
} from "@fortawesome/free-solid-svg-icons";
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
            faSquareCheck,
            faFlagUsa,
            faPlus,
            faPen,
            faTrash,
            faClock,
            selected: "username",
            sort: "ASC",
            genders: [
                { value: "Masculino", text: "Masculino" },
                { value: "Feminino", text: "Feminino" },
                { value: "Outro", text: "Outro" },
            ],
            filterSearch: "",
            modalTitle: "",
            submitted: false,
            updateUserState: false,
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
                    // thStyle: { width: "15%" },
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
            perPage: 10,
            currentPage: 1
        };
    },
    computed: {
        resultedUsers: function () {
            this.renameBirthdayWithoutYear();
            this.setFullName();

            return this.users.filter((user) => {
                if ((this.selected === "nationality") && (this.filterSearch.length > 1)) {
                    return user.nat.includes(this.filterSearch);
                } else if ((this.selected === "username") && (this.filterSearch.length > 3)) {
                    return user.fullName.includes(this.filterSearch);
                } else {
                    return user;
                }
            });
        },
    },
    async crated() {

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
            this.modalTitle = "Informações do Usuário";
            this.setModalData(user);

        },  

        setModalData(user) {
            this.user.userId = user.userId;
            this.user.userImage = user.picture.thumbnail;
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

        async handleSubmit() {
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
        },  

        renameBirthdayWithoutYear: function () {
            this.users.forEach((user) => {
                user.birthday = moment(user.dobd.date).format("DD/MM");
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
            this.$refs.modal.hide();
            this.updateUserState = !this.updateUserState;
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