from setuptools import setup

setup(
    name='colloquium',
    packages=['colloquium'],
    include_package_data=True,
    install_requires=[
        'flask',
        'python-dotenv',
        'flask_sqlalchemy',
        'wtforms',
        'email_validator'
    ],
)
