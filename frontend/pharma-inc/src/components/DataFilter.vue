<template>
    <div class="search-wrapper m-3">
        <img :src="searchIcon" alt="icon" />
        <b-form-input @input="search()" v-model="filterSearch" placeholder="Digite aqui..."></b-form-input>
    </div>
</template>

<script>
import searchIcon from "@/assets/icons/magnify.svg";

export default {
    data() {
        return {
            searchIcon,
            filterSearch: ""
        };
    },
    methods: {
        search() {
            this.$emit("onUpdatedFilterSearch", this.filterSearch);
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
</style>
