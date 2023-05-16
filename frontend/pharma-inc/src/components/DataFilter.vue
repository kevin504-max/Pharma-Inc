<template>
    <div>
        <div class="search-wrapper m-3">
            <img :src="searchIcon" alt="icon" class="mr-2" />
            <b-form-input @input="search()" v-model="filterSearch" placeholder="Digite aqui..."></b-form-input>
        </div>
        <h5>Filtrar por gênero</h5>
        <div class="select-wrapper m-3">
            <img :src="userIcon" alt="icon" class="mr-2" />
            <b-form-select v-model="gender" :options="options" @change="filterGender()"></b-form-select>
        </div>
    </div>
</template>

<script>
import searchIcon from "@/assets/icons/magnify.svg";
import userIcon from "@/assets/icons/2044.svg";

export default {
    data() {
        return {
            searchIcon,
            userIcon,
            options: [
                "male",
                "female"
            ],
            gender: "",
            filterSearch: ""
        };
    },
    methods: {
        search() {
            this.$emit("onUpdatedFilterSearch", this.filterSearch);
        },
        filterGender() {
            this.$emit("onUpdatedFilterGender", this.gender);
        }
    }
};
</script>

<style>
.search-wrapper {
    display: flex;
    align-items: center;
    justify-content: flex-end;
} 

.search-wrapper .form-control[type="text"] {
    height: 40px;
    width: 300px;
}

.search-wrapper .form-control[type="text"]:focus {
    box-shadow: none;
    border-color: #b9b9b9 !important;
}

.select-wrapper {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding: 5px;
  background-color: #f5f5f5;
  width: 300px;
  cursor: pointer;
}

.select-wrapper .form-control {
  margin: 0;
  border: none;
  box-shadow: none;
  outline: none;
  background-color: transparent;
  font-size: 14px;
  color: #333;
}

.select-wrapper .form-control:focus {
  outline: none;
}

</style>
