import os
import secrets
from PIL import Image
from flask import request, current_app
from urllib.parse import urlparse, urljoin
## save the file as a random hex attached to the file extension 
def save_picture(form_picture):
	random_hex = secrets.token_hex(8)
	_, f_ext = os.path.splitext(form_picture.filename)
	picture_fn = random_hex + f_ext 
	picture_path = os.path.join(current_app.root_path, 'static/profile_pics', picture_fn)
	
	## resize the image before saving to file system	
	output_size = (125, 125)

	i = Image.open(form_picture)
	i.thumbnail(output_size)
	i.save(picture_path)

	return picture_fn 

## check if redirect target will be the same server 
def is_safe_url(target):
    ref_url = urlparse(request.host_url)
    test_url = urlparse(urljoin(request.host_url, target))
    return test_url.scheme in ('http', 'https') and \
           ref_url.netloc == test_url.netloc