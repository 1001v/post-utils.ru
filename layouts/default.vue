<template>
  <div>
    <div class="mb-2">
      <!-- Image and text -->
      <b-navbar variant="light navbar-justify-normal" type="light">
        <b-navbar-brand>
          <img src="data:image/png;base64,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" class="d-inline-block align-top" alt="BV">
        </b-navbar-brand>
        <b-navbar-brand>Печать бланков для сотрудников почты</b-navbar-brand>
      </b-navbar>
    </div>
    <div class="row container-fluid">
      <div class="col-3 main-menu">
        <div class="card border-light">
          <div class="card-header">
            Меню
          </div>
          <div class="list-group list-group-menu">
            <nuxt-link class="list-group-item list-group-item-action" to="/f20">ф.20 на досыл/возврат</nuxt-link>
            <nuxt-link class="list-group-item list-group-item-action" to="/f30">ф.30 на нарушения</nuxt-link>
            <nuxt-link class="list-group-item list-group-item-action" to="/vedomost">Ведомость учета МЖД</nuxt-link>
            <nuxt-link class="list-group-item list-group-item-action" to="/dm">Упаковочный лист ДМ</nuxt-link>
            <nuxt-link class="list-group-item list-group-item-action" to="/help">Помощь</nuxt-link>
            <nuxt-link class="list-group-item list-group-item-action" to="/settings">Настройки</nuxt-link>
            <nuxt-link class="list-group-item list-group-item-action" to="/about">О программе</nuxt-link>
          </div>
        </div>
      </div>
      <div class="col-9 nuxt-wrapper">
        <nuxt/>
      </div>
    </div>
  </div>
</template>