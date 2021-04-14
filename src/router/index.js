import { createRouter, createWebHistory } from "vue-router";
import Game from "../views/Game.vue";
import GameV1 from "@/components/GameOfLife.vue";

const routes = [
  {
    path: "/",
    name: "Game",
    component: Game,
  },
  {
    path: "/v1",
    name: "GameV1",
    component: GameV1,
  },
  /*   {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import('../views/About.vue')
  } */
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
