<template>
    <div class="search-wrapper">
        <img />
        <b-form-input @input="search()" v-model="searchText" placeholder="Digite aqui..."></b-form-input>
    </div>
</template>

<script>
import faSearch from "@fortawesome/free-solid-svg-icons";

export default {
    data () {
        return {
            faSearch,
            searchText: ""
        };
    },
    methods: {
        search() {
            this.$emit("onSearchTextChanged", this.searchText);
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

.serach-wrapper .form-control[type="text"]:focus {
    box-shadow: none;
    border-color: #b9b9b9 !important;
}

</style>