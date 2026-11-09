# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-11-29

### Added
- Initial release
- IP address detection with multiple header support
- Country code lookup via geoip-lite
- CORS support
- Security headers (X-Content-Type-Options, X-Frame-Options, etc.)
- IPv6-mapped IPv4 address normalisation
- Cloudflare IP header support
- Documentation, CI/CD, issue and PR templates
- Contributing guidelines, Code of Conduct, security policy

### Security
- Security headers on all responses
- Input validation and sanitisation
- No data logging or storage

[Unreleased]: https://github.com/hmddevs/ip-api/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/hmddevs/ip-api/releases/tag/v1.0.0
