import Knex = require('knex');

export class HospSystemModels {
  info(knex: Knex) {
    return knex('hosp_system')
  }
}