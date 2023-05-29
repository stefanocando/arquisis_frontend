<script>
import LogoutButton from "@/components/buttons/LogoutButton.vue";
import { RouterLink } from "vue-router";

export default {
  components: {
    LogoutButton,
    RouterLink,
  },
  data() {
    return {
      user: this.$auth0.user,
      data: "",
      loadingEvents: true,
      currentPage: 0,
      moneyMessage: "",
      moneyToAdd: 0,
    };
  },
  methods: {
    async fetchUserData() {
      const token = await this.$auth0.getAccessTokenSilently();
      const userId = this.user.sub.split("|")[1];
      fetch(`https://api.stefanocando.me/user`, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ user_id: userId }),
      })
        .then((response) => response.json())
        .then((data) => {
          this.user.money = data.user.money;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchInitEvents() {
      fetch(`https://api.stefanocando.me/?page=0`)
        .then((response) => response.json())
        .then((data) => {
          this.data = data.events;
          this.loadingEvents = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    fetchEvents(action) {
      this.loadingEvents = true;
      action === "prev" ? this.currentPage-- : this.currentPage++;
      fetch(`https://api.stefanocando.me/?page=${this.currentPage}`)
        .then((response) => response.json())
        .then((data) => {
          this.data = data.events;
          this.loadingEvents = false;
        })
        .catch((error) => {
          console.log(error);
        });
    },
    async addMoney() {
      const token = await this.$auth0.getAccessTokenSilently();
      console.log(token);
      const userId = this.user.sub.split("|")[1];
      if (this.moneyToAdd > 0) {
        const quantity = this.moneyToAdd;
        try {
          const response = await fetch(`https://api.stefanocando.me/addMoney`, {
            method: "POST",
            mode: "cors",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ user_id: userId, money: quantity }),
          });
          this.moneyMessage = (await response.json()).message;
          this.moneyToAdd = 0;
        } catch (error) {
          this.moneyMessage = error;
        }
      } else {
        this.moneyMessage =
          "El dinero a agregar debe tomar valores positivos distintos a 0";
        this.moneyToAdd = 0;
      }
    },
    eventToQueryString(event) {
      const newParams = new URLSearchParams(event).toString();
      return newParams;
    },
  },
  mounted() {
    this.fetchInitEvents();
    this.fetchUserData();
  },
  computed: {
    code() {
      return JSON.stringify(this.user, null, 2);
    },
    pages() {
      return Math.ceil(this.events.length / this.eventsPerPage);
    },
    totalPages() {
      return this.pages === 0 ? 1 : this.pages;
    },
  },
};
</script>

<template>
  <div class="d-flex flex-column justify-content-center align-items-center">
    <div class="container">
      <!-- User info section -->
      <div class="row mb-5">
        <div class="col-md-6 mx-auto text-center">
          <img
            :src="user.picture"
            alt="User profile picture"
            height="50"
            width="50"
            class="rounded"
          />
          <h3>{{ user.nickname }}</h3>
          <p class="lead">{{ user.email }}</p>
          <div>
            <h4>Dinero: {{ user.money }}</h4>
            <input
              type="number"
              v-model="moneyToAdd"
              class="mx-3 my-3 w-10 text-center"
              min="0"
            />
            <button class="btn btn-primary mx-3" @click="addMoney">
              Agregar dinero
            </button>
          </div>
          <p v-if="moneyMessage !== ''">
            {{ moneyMessage }}
          </p>
          <LogoutButton />
          <RouterLink class="btn btn-link" to="/requests"
            >Ir a tus solicitudes de compra</RouterLink
          >
        </div>
      </div>

      <!-- Events table section -->
      <div v-if="loadingEvents">
        <div
          class="d-flex flex-column justify-content-center align-items-center vh-100"
        >
          <div class="text-center spinner-border" role="status">
            <span class="visually-hidden">Cargando...</span>
          </div>
          <div>Cargando eventos</div>
        </div>
      </div>
      <div v-else class="row">
        <div class="col-md-10">
          <h4>Eventos</h4>
          <table class="table table-striped">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nombre</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="event in data" :key="event.event_id">
                <td>{{ event.event_id }}</td>
                <td>
                  {{
                    event.name.length > 60
                      ? event.name.substring(0, 60) + "..."
                      : event.name
                  }}
                </td>
                <td>{{ event.date.split("T")[0] }}</td>
                <td>
                  <RouterLink
                    class="btn btn-outline-primary"
                    :to="'/event?' + eventToQueryString(event)"
                    >Más información</RouterLink
                  >
                </td>
              </tr>
            </tbody>
          </table>
          <nav aria-label="Page navigation">
            <ul class="pagination">
              <li class="page-item" :class="{ disabled: currentPage === 0 }">
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="fetchEvents('prev')"
                  >Previo</a
                >
              </li>
              <li class="page-item">
                <a
                  class="page-link"
                  href="#"
                  @click.prevent="fetchEvents('next')"
                  >Siguiente</a
                >
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  </div>
</template>
