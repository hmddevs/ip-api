# Security Policy

## Supported Versions

We release patches for security vulnerabilities for the following versions:

| Version | Supported          |
| ------- | ------------------ |
| 1.x.x   | :white_check_mark: |

## Reporting a Vulnerability

We take the security of IP API seriously. If you believe you have found a security vulnerability, please report it to us as described below.

### Please Do

- **Email us** at security@hmddevs.org with details of the vulnerability
- **Provide** as much information as possible about the vulnerability
- **Allow** reasonable time for us to respond before disclosing publicly
- **Make a good faith effort** to avoid privacy violations, data destruction, or service disruption

### Please Don't

- **Don't** open public GitHub issues for security vulnerabilities
- **Don't** access or modify data that doesn't belong to you
- **Don't** perform attacks that could harm the availability of the service

## What to Include

When reporting a vulnerability, please include:

1. **Description** of the vulnerability
2. **Steps to reproduce** the issue
3. **Potential impact** of the vulnerability
4. **Suggested fix** (if any)

## Response Timeline

- **24 hours**: Initial acknowledgment of your report
- **72 hours**: Initial assessment of the vulnerability
- **7 days**: Detailed response with planned remediation
- **90 days**: Target for vulnerability fix and disclosure

## Security Best Practices

When self-hosting IP API:

1. **Keep dependencies updated** - Regularly run `npm audit` and update packages
2. **Use HTTPS** - Always serve the API over HTTPS in production
3. **Rate limiting** - Consider implementing rate limiting for high-traffic deployments
4. **Monitor logs** - Keep an eye on access patterns for anomalies

## Disclosure Policy

When we receive a security bug report, we will:

1. Confirm the problem and determine affected versions
2. Audit code to find any similar problems
3. Prepare fixes for all supported versions
4. Release patches as soon as possible

## Recognition

We appreciate security researchers who help keep IP API safe. Contributors who report valid security issues will be acknowledged in our release notes (unless they prefer to remain anonymous).

---

Thank you for helping keep IP API and its users safe!

**Umut Güden**
