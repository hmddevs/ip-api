<div align="center">

# IP API

[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Deploy with Vercel](https://img.shields.io/badge/Vercel-Deployed-black?logo=vercel)](https://ip.hmddevs.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white)](https://nodejs.org/)

**Privacy-focused IP geolocation API.**

[Live](https://ip.hmddevs.org) · [Report a Bug](https://github.com/hmddevs/ip-api/issues) · [Request a Feature](https://github.com/hmddevs/ip-api/issues)

---

</div>

## Features

- Sub-100ms responses via Vercel's edge network
- No logging, no tracking, no data storage
- Accurate geolocation data for IPs worldwide
- No API keys required
- Open source and free to use
- Minimal response payload

## Quick Start

```bash
curl https://ip.hmddevs.org
```

```json
{
  "ip": "8.8.8.8",
  "country": "US"
}
```

## API

### Endpoint

```
GET https://ip.hmddevs.org/
```

### Response Fields

| Field     | Type     | Description                                                          |
|-----------|----------|----------------------------------------------------------------------|
| `ip`      | `string` | The client's public IP address                                       |
| `country` | `string` | ISO 3166-1 alpha-2 country code (e.g. `US`, `DE`, `JP`)             |

### Status Codes

| Code  | Description         |
|-------|---------------------|
| `200` | Successful response |

## Usage Examples

### JavaScript (Fetch)

```javascript
fetch('https://ip.hmddevs.org')
  .then(response => response.json())
  .then(data => {
    console.log(`IP: ${data.ip}`);
    console.log(`Country: ${data.country}`);
  });
```

### JavaScript (Async/Await)

```javascript
const getLocation = async () => {
  const response = await fetch('https://ip.hmddevs.org');
  const { ip, country } = await response.json();
  return { ip, country };
};
```

### Python

```python
import requests

response = requests.get('https://ip.hmddevs.org')
data = response.json()
print(f"IP: {data['ip']}, Country: {data['country']}")
```

### cURL

```bash
curl -s https://ip.hmddevs.org | jq
```

### PHP

```php
<?php
$response = file_get_contents('https://ip.hmddevs.org');
$data = json_decode($response, true);
echo "IP: " . $data['ip'] . ", Country: " . $data['country'];
?>
```

### Go

```go
package main

import (
    "encoding/json"
    "fmt"
    "net/http"
)

type IPResponse struct {
    IP      string `json:"ip"`
    Country string `json:"country"`
}

func main() {
    resp, _ := http.Get("https://ip.hmddevs.org")
    defer resp.Body.Close()

    var data IPResponse
    json.NewDecoder(resp.Body).Decode(&data)
    fmt.Printf("IP: %s, Country: %s\n", data.IP, data.Country)
}
```

### Ruby

```ruby
require 'net/http'
require 'json'

uri = URI('https://ip.hmddevs.org')
response = Net::HTTP.get(uri)
data = JSON.parse(response)
puts "IP: #{data['ip']}, Country: #{data['country']}"
```

### Rust

```rust
use reqwest;
use serde::Deserialize;

#[derive(Deserialize)]
struct IpResponse {
    ip: String,
    country: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let resp: IpResponse = reqwest::get("https://ip.hmddevs.org")
        .await?
        .json()
        .await?;
    println!("IP: {}, Country: {}", resp.ip, resp.country);
    Ok(())
}
```

## Self-Hosting

### Prerequisites

- [Node.js](https://nodejs.org/) 18+
- [Vercel CLI](https://vercel.com/cli) (optional)

### Installation

```bash
git clone https://github.com/hmddevs/ip-api.git
cd ip-api
npm install
```

### Local Development

```bash
npm run dev
```

Visit `http://localhost:3000` to test locally.

### Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/hmddevs/ip-api)

Or via CLI:

```bash
npm install -g vercel
vercel --prod
```

## Project Structure

```
ip-api/
├── api/
│   └── index.js            # Main API handler
├── test/
│   └── api.test.js         # Unit tests
├── .github/
│   ├── ISSUE_TEMPLATE/     # Issue templates
│   ├── workflows/          # CI/CD
│   └── dependabot.yml      # Dependency updates
├── openapi.yaml            # OpenAPI 3.1 specification
├── package.json
├── vercel.json
├── CHANGELOG.md
├── CONTRIBUTING.md
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── LICENSE
```

## Scripts

```bash
npm run dev          # Start development server
npm run lint         # Run linting
npm run lint:fix     # Fix linting issues
npm test             # Run tests
npm run deploy       # Deploy to production
```

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

## Security

Found a vulnerability? See [SECURITY.md](SECURITY.md).

## Licence

[Apache 2.0](LICENSE)

## Acknowledgements

- [MaxMind GeoLite2](https://dev.maxmind.com/geoip/geolite2-free-geolocation-data) for geolocation data
- [geoip-lite](https://github.com/geoip-lite/node-geoip) for the Node.js geolocation library
- [Vercel](https://vercel.com) for hosting

---

<div align="center">

Copyright 2025 [HMD Developments, Inc.](https://hmddevs.org)

</div>
