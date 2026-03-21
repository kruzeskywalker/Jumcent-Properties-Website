import os
import re

footer_html = """  <!-- FOOTER -->
  <footer class="footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Jumcent Properties</h3>
          <p>Premium serviced accommodation for business and leisure stays in the UK.</p>
          <div class="footer-social">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="social-link"
              aria-label="Facebook">
              <span>📘</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="social-link"
              aria-label="Instagram">
              <span>📷</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" class="social-link"
              aria-label="Twitter">
              <span>🐦</span>
            </a>
          </div>
        </div>

        <div class="footer-section">
          <h3>Quick Links</h3>
          <a href="index.html">Home</a>
          <a href="properties.html">Properties</a>
          <a href="about.html">About Us</a>
          <a href="contact.html">Contact</a>
        </div>

        <div class="footer-section">
          <h3>Book With Us</h3>
          <a href="https://www.airbnb.co.uk" target="_blank" rel="noopener noreferrer">Airbnb Listings</a>
          <a href="https://www.booking.com" target="_blank" rel="noopener noreferrer">Booking.com Listings</a>
        </div>

        <div class="footer-section">
          <h3>Contact Us</h3>
          <p>📧 info@skykruze.com</p>
          <p>📱 +44 7751 573 029</p>
          <p>📍 London, United Kingdom</p>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; 2026 Jumcent Properties. All rights reserved.</p>
      </div>
    </div>
  </footer>"""

files_to_process = [
    'about.html',
    'contact.html',
    'properties.html',
    'property-campbell.html',
    'property-skyhouse.html',
    'property-template.html'
]

variable_replacements = {
    'var(--color-primary)': 'var(--text)',
    'var(--color-text-secondary)': 'var(--text-muted)',
    'var(--color-secondary)': 'var(--secondary)',
    'var(--color-white)': 'var(--text)',
    'var(--color-grey-100)': 'var(--bg-alt)',
    'var(--color-accent)': 'var(--primary)',
    'var(--shadow-xl)': '0 20px 25px -5px rgba(0, 0, 0, 0.4)'
}

for fname in files_to_process:
    if not os.path.exists(fname):
        print(f"{fname} not found!")
        continue
    
    with open(fname, 'r') as f:
        content = f.read()
    
    # Replace the footer block
    content = re.sub(r'<!-- FOOTER[\s\S]*?</footer>', footer_html, content)
    
    # Replace old CSS variables that were used inline
    for old, new in variable_replacements.items():
        content = content.replace(old, new)
        
    # Replace hardcoded light backgrounds
    content = content.replace('background-color: #f8f9fa;', 'background-color: var(--bg-alt);')
    content = content.replace('background-color: #ffffff;', 'background-color: var(--bg);')
    content = content.replace('background-color:#f8f9fa;', 'background-color: var(--bg-alt);')
    content = content.replace('background-color:#ffffff;', 'background-color: var(--bg);')
    
    with open(fname, 'w') as f:
        f.write(content)

print("Updated HTML files for dark theme.")
