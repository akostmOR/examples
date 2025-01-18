# Passthrough Authentication Example

This project demonstrates how to integrate **ClientWire** into an existing system via **Passthrough Authentication**. It shows how to:

1. **Configure** a tenant to accept your own external tokens (via a “user info” endpoint).
2. **Create** or **Update** a conversation using the `PUT /api/v1/conversations/{id}` endpoint.
3. **Display** conversation data in a simple CRM-like table.
4. **Open** a ClientWire chat widget for a given conversation ID.

> **Warning**: This example **makes real API calls** to the tenant whose API key you use. It will:
> - **Patch** the tenant to set a `passthrough_userinfo_url`.
> - **Create** or **update** actual conversations on that tenant.

Make sure you’re using a **test tenant** or understand that these changes are permanent.

---

## How This Works

1. **Tenant Setup**  
   - Provide your **API Key** for the tenant, along with a **User Info Endpoint** that validates tokens from your system.
   - The example calls `GET /api/v1/tenant` to confirm your API key is valid and retrieve your tenant’s ID/name.
   - It then `PATCH`es `/api/v1/tenant` to set the `passthrough_userinfo_url`.
   - Finally, we **initialize** the ClientWire SDK using that tenant ID.

2. **Passthrough Test**  
   - You specify a **token** from your system.
   - Clicking **Test API Call** sends a request to `POST /api/v1/signin/passthrough`, letting ClientWire validate that token via your `/userInfo` endpoint..
   - This starts the following sequence:
     - Your Frontend hands token to the ClientWire SDK.
     - The ClientWire SDK calls `POST /api/v1/signin/passthrough` and passes your token.
     - Our API then calls your `/userInfo` endpoint with your token as `Authorization: Bearer <your token>`.
     - Your `/userInfo` endpoint either returns `200` or `401`.
     - If your `/userInfo` endpoint returns `200` the ClientWire API will issue ClientWire tokens back to the ClientWire SDK.
     - Now the ClientWire SDK can make authenticated calls against to ClientWire API.

3. **Creating Conversations**  
   - Click **Add or Update** to run a `PUT /api/v1/conversations/{conversation_id}` call. This sets `conversation_data` and includes a **CLIENT** participant named “Marie.”  
   - The table is **reloaded** with a `GET /api/v1/conversations?limit=100` to reflect the new or updated conversations on your tenant.

4. **CRM-Like UI**  
   - A simple “Cases” table is displayed. Each row has a “Chat” button. In a real application, you’d call `clientwire.openConversation(conversationId)` to open an embedded chat widget directly in your app.

---

## Common API Operations

Below are some reference calls you can make independently (outside this example) when setting up your tenant or user accounts.

### 1. Getting Tenant ID by Subdomain

If you already know your tenant’s subdomain, you can retrieve its config (including the tenant ID) without authentication:

```
GET /api/v1/tenant/config?tenant_subdomain=<YOUR_SUBDOMAIN>
```

Example:
```bash
curl -X GET "https://api.production.clientwire.net/api/v1/tenant/config?tenant_subdomain=acme"
```

**Sample Response**:
```json
{
  "id": "123e4567-e89b-12d3-a456-426614174000",
  "subdomain": "acme",
  "frontend_url": "https://acme.clientwire.net",
  "name": "Acme Inc.",
  "enabled": true,
  "oidc_configs": []
}
```

### 2. Logging In (ROPC / Email)

If you have a user with an email and password, you can fetch a **Bearer token** via:

```
POST /api/v1/signin/email
```

**Example**:
```bash
curl -X POST https://api.production.clientwire.net/api/v1/signin/email \
  -H "Content-Type: application/json" \
  -d '{
    "tenant_id": "123e4567-e89b-12d3-a456-426614174000",
    "email": "owner@acme.com",
    "password": "secret"
  }'
```

### 3. Creating an API Key

If you have an **OWNER** token, you can create an API key with:

```
POST /api/v1/api_keys
```

**Example**:
```bash
curl -X POST https://api.production.clientwire.net/api/v1/api_keys \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_OWNER_TOKEN" \
  -d '{
    "name": "My Passthrough Demo Key",
    "expires_at": "2030-01-01T00:00:00Z"
  }'
```

**Response**:
```json
{
  "key_id": "abc123",
  "api_key": "some-secret-token-value",
  "name": "My Passthrough Demo Key",
  "expires_at": "2030-01-01T00:00:00Z"
}
```

> **Note**: The `api_key` value appears **only once**. Store it securely.

### 4. Using That API Key

- Set `X-API-Key: <API_KEY_VALUE>` in your requests to authenticate.  
- Patch the tenant (`PATCH /api/v1/tenant`) to set `passthrough_userinfo_url`.  
- Create or update conversations (`PUT /api/v1/conversations/{id}`).

---

## Running This Example

1. **Clone** or **download** this repository into a folder.
2. **Run** the included `serve.sh` (or any local server) to serve on `http://localhost:8090`.
3. **Open** your browser at `http://localhost:8090`.
4. Enter:
   - **API Key** (the one you created above).
   - **User Info Endpoint** (a URL in your system that validates tokens).
   - **Token** (from your system).
5. Click **Setup**:
   - Retrieves tenant info with `GET /api/v1/tenant`.
   - Patches tenant with your `passthrough_userinfo_url`.
   - Loads existing conversations with `GET /api/v1/conversations`.
   - Initializes the ClientWire SDK.
6. (Optional) Click **Test API Call** to validate your token with `POST /api/v1/signin/passthrough`.
7. Click **Add or Update** to create a conversation, then see it appear in the table.

---

## Questions or Issues?

- Consult the [ClientWire Documentation](https://clientwire.net/docs) for more details.
- Open a GitHub issue in this repo or contact us via [support@clientwire.net](mailto:support@clientwire.net) for help.
