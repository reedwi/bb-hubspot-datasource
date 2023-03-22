import { IntegrationBase } from "@budibase/types"
import fetch from "node-fetch"

interface Query {
  method: string
  body?: string
  headers?: { [key: string]: string }
}

class CustomIntegration implements IntegrationBase {
  private readonly url: string
  private readonly private_app_token: string;

  constructor(config: { url: string; private_app_token: string; }) {
    this.url = `https://api.hubapi.com/crm/v3/objects`;
    this.private_app_token = config.private_app_token;
  }

  async request(url: string, opts: Query) {
    if (!this.private_app_token) {
      throw new Error("Need to provide an app token");
    }
    const auth = { authorization: `Bearer ${this.private_app_token}`};
    opts.headers = {
      'content-type': 'application/json',
      'authorization': `Bearer ${this.private_app_token}`
    }
    const response = await fetch(url, opts)
    if (response.status <= 300) {
      try {
        const contentType = response.headers.get("content-type")
        if (contentType?.includes("json")) {
          return await response.json()
        } else {
          return await response.text()
        }
      } catch (err) {
        return await response.text()
      }
    } else {
      const err = await response.text()
      throw new Error(err)
    }
  }

  async create(query: { properties: string, extra: { [key: string]: string } }) {
    const properties = {
      properties: JSON.parse(query.properties)
    }
    const opts = {
      method: "POST",
      body: JSON.stringify(properties),
      headers: {
        "Content-Type": "application/json",
      },
    }
    // console.log(query.json);
    let url = `${this.url}/${query.extra.type}`
    return this.request(url, opts)
  }

  async read(query: { id: string , extra: { [key: string]: string }  }) {
    const opts = {
      method: "GET",
    }
    if (query.id) {
      return this.request(`${this.url}/${query.extra.type}/${query.id}`, opts)
    }
    return this.request(`${this.url}/${query.extra.type}`, opts)
  }

  async update(query: { id: string, properties: string, extra: { [key: string]: string } }) {

  const properties = {
    properties: JSON.parse(query.properties)
  }

  const opts = {
    method: "PATCH",
    body: JSON.stringify(properties),
    headers: {
      "Content-Type": "application/json",
    },
  }
  let url = `${this.url}/${query.extra.type}/${query.id}`
  return this.request(url, opts)
}

  async delete(query: { id: string, extra: { [key: string]: string }}) {
    const opts = {
      method: "DELETE",
    }
    return this.request(`${this.url}/${query.extra.type}${query.id}`, opts)
  }
}

export default CustomIntegration
