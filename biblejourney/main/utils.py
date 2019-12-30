## convert a list of objects to list of dictionaries
def convert_obj(l):
	return_dict = [] 
	for obj in l:
		d = dict()
		for key in obj.__dict__:
			if (key != '_sa_instance_state'):
				d[key] = obj.__dict__[key]
		return_dict.append(d)
	return return_dict
