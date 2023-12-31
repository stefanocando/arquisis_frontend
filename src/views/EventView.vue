<script>
import { RouterLink } from "vue-router";
export default {
  components: {
    RouterLink,
  },
  props: {
    event_id: { type: String, required: true },
    name: { type: String, required: true },
    date: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    location: { type: String, required: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    createdAt: { type: String, required: true },
    updatedAt: { type: String, required: true },
  },
  data() {
    return {
      money: 0,
      buyingTickets: false,
      ticketsQuantity: 1,
      requestSend: false,
      user: this.$auth0.user,
      errorMessage: "",
    };
  },
  computed: {
    totalPrice() {
      return this.ticketsQuantity * this.price;
    },
  },
  methods: {
    validateTotalPrice() {
      if (this.totalPrice > this.money) {
        this.errorMessage = "El precio total sobrepasa el dinero que tienes";
        return false;
      }
      return true;
    },
    async fetchUserData() {
      const token = await this.$auth0.getAccessTokenSilently();
      const userId = this.user.sub.split("|")[1];
      try {
        const response = await fetch(`https://api.stefanocando.me/user`, {
          method: "POST",
          mode: "cors",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_id: userId }),
        })
        
        const data = await (response.json())
        this.money = data.money
      } catch (error) {
        console.log(error)
      }
    },
    increaseTickets() {
      this.ticketsQuantity++;
    },
    decreaseTickets() {
      if (this.ticketsQuantity > 1) {
        this.ticketsQuantity--;
      }
    },
    async sendBuyingRequest() {
      if (this.buyingTickets && this.validateTotalPrice()) {
        const token = await this.$auth0.getAccessTokenSilently();
        const userId = this.user.sub.split("|")[1];
        try {
          await fetch("https://stefanocando.me/request/new", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              user_id: userId,
              event_id: this.event_id,
              deposit_token: "",
              quantity: this.ticketsQuantity,
              seller: 0,
            }),
          });
          this.requestSend = true;
        } catch (error) {
          this.errorMessage = error;
        }
      } else {
        this.buyingTickets = true;
      }
    },
  },
  mounted() {
    this.fetchUserData()
  }
};
</script>
<template>
  <div class="d-flex justify-content-center align-items-center vh-100">
    <div class="container">
      <div class="row justify-content-center">
        <h2 class="text-center">Evento</h2>
        <div class="col-md-6">
          <table class="table table-bordered">
            <tbody>
              <tr>
                <td class="fw-bold text-center">Evento</td>
                <td class="text-center">{{ name }}</td>
              </tr>
              <tr>
                <td class="fw-bold text-center">Fecha</td>
                <td class="text-center">{{ date.split("T")[0] }}</td>
              </tr>
              <tr>
                <td class="fw-bold text-center">Precio</td>
                <td class="text-center">${{ price }}</td>
              </tr>
              <tr>
                <td class="fw-bold text-center">Ubicación</td>
                <td class="text-center">{{ location }}</td>
              </tr>
              <tr>
                <td class="fw-bold text-center">Entradas restantes</td>
                <td class="text-center">{{ quantity }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <h3 class="text-center">Dinero: {{ money }}</h3>
        <div v-if="buyingTickets" class="text-center">
          <div class="align-items-center justify-content-center d-flex">
            <button class="btn btn-danger" @click="decreaseTickets">-</button>
            <input
              type="number"
              v-model="ticketsQuantity"
              class="mx-3 my-3 w-10 text-center"
              min="1"
            />
            <button class="btn btn-success" @click="increaseTickets">+</button>
          </div>
        </div>
        <div v-if="buyingTickets" class="text-center">
          <p>Total = {{ totalPrice }}</p>
        </div>
        <div class="text-center">
          <button class="btn btn-primary mx-3" @click="sendBuyingRequest">
            Comprar entrada
          </button>
          <RouterLink class="btn btn-link mx-3" to="/profile"
            >Volver</RouterLink
          >
        </div>
        <div v-if="requestSend" class="text-center my-3">
          Se ha enviado una solicitud para comprar entradas. El dinero se va a descontar un vez se valide tu compra.
        </div>
        <div v-if="errorMessage" class="text-center my-3">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  </div>
</template>
