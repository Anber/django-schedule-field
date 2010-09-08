import os, schedule_field
from setuptools import setup

if schedule_field.VERSION[-1] == 'final':
    CLASSIFIERS = ['Development Status :: 5 - Stable']
elif 'beta' in schedule_field.VERSION[-1]:
    CLASSIFIERS = ['Development Status :: 4 - Beta']
else:
    CLASSIFIERS = ['Development Status :: 3 - Alpha']

CLASSIFIERS += [
    'Environment :: Web Environment',
    'Framework :: Django',
    'Intended Audience :: Developers',
    'License :: OSI Approved :: BSD License',
    'Topic :: Internet :: WWW/HTTP :: Dynamic Content',
]

setup(
    author = schedule_field.__maintainer__,
    author_email = schedule_field.__email__,
    name = 'django-schedule-field',
    version = schedule_field.__version__,
    description = 'Schedule field for Django Form',
    long_description = open(os.path.join(os.path.dirname(__file__), 'README.md')).read(),
    url = 'http://github.com/Anber/django-schedule-field/tree/master',
    license = 'BSD License',
    platforms=['OS Independent'],
    classifiers = CLASSIFIERS,
    requires=[
        'django (>1.1)',
    ],
    packages=['schedule_field'],
    package_data={'schedule_field': ['fixtures/*']},
    zip_safe=False
)