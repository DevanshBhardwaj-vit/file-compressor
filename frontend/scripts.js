document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
  
    const formData = new FormData(this);
    fetch('/upload', {
      method: 'POST',
      body: formData
    })
    .then(response => response.blob())
    .then(blob => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = 'compressed.zip';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.getElementById('result').innerHTML = `<p><i class="fas fa-check-circle"></i> Compression successful! Your file is downloading...</p>`;
    })
    .catch(error => {
      console.error('Error:', error);
      document.getElementById('result').innerHTML = `<p style="color: red;"><i class="fas fa-times-circle"></i> Compression failed. Please try again.</p>`;
    });
  });
  