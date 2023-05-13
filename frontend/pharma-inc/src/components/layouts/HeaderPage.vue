<template>
<div class="fixed pin-t pin-x z-40">
    <nav class="flex items-center justify-between text-black bg-navbar shadow-xs h-16">
        <div class="flex flex-no-shrink items-center">
            <a class="flex flex-no-shrink items-center text-black mx-4">
                <img src="@/assets/logo.png" alt="Pharma Inc" class="img-fluid m-2" width="100">
                <span class="company d-inline-block font-semibold mx-1">Pharma Inc</span>
            </a>
            <img src="@/assets/default-avatar.jpg" alt="image" class="img-fluid img-circle float-end m-3" width="60">
        </div>
    </nav>
</div>
</template>

<script>

export default {
    name: 'HeaderPage',
    components: {
    }
}
</script>


<style scoped>
.fixed {
  position: fixed;
}

.pin-t {
  top: 0;
}

.pin-x {
  left: 0;
  right: 0;
}

.z-40 {
  z-index: 40;
}

.bg-navbar {
  background-color: #B4F8C8;
}

.company {
    font-size: 1.5rem;
    padding: 0.5rem;
    color: #37bb5f;
}

.flex-no-shrink {
  flex-shrink: 0;
}

.font-semibold {
  font-weight: 600;
}

.img-circle {
    border-radius: 50%;
}

</style>