document.addEventListener('DOMContentLoaded', () => {

})

document.addEventListener('DOMContentLoaded', () => {
    const dogForm = document.getElementById('dog-form');
    const tableBody = document.getElementById('table-body');
    const renderDogs = async () => {
      tableBody.innerHTML = '';
      try {
        const response = await fetch('http://localhost:3000/dogs');
        const dogs = await response.json();
  
        dogs.forEach(dog => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${dog.name}</td>
            <td>${dog.breed}</td>
            <td>${dog.sex}</td>
            <td><button class="edit-btn" data-id="${dog.id}">Edit</button></td>
          `;
          tableBody.appendChild(row);
        });
  
        document.querySelectorAll('.edit-btn').forEach(button => {
          button.addEventListener('click', async () => {
            const dogId = button.getAttribute('data-id');
            const dogResponse = await fetch(`http://localhost:3000/dogs/${dogId}`);
            const dogData = await dogResponse.json();
            dogForm.elements['name'].value = dogData.name;
            dogForm.elements['breed'].value = dogData.breed;
            dogForm.elements['sex'].value = dogData.sex;
            dogForm.setAttribute('data-id', dogId);
          });
        });
      } catch (error) {
        console.error('Error fetching and rendering dogs:', error);
      }
    };
    renderDogs();
  
    dogForm.addEventListener('submit', async (event) => {
      event.preventDefault();
      const dogId = dogForm.getAttribute('data-id');
      const formData = new FormData(dogForm);
      const updatedDog = {
        name: formData.get('name'),
        breed: formData.get('breed'),
        sex: formData.get('sex')
      };
  
      try {
        await fetch(`http://localhost:3000/dogs/${dogId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedDog)
        });
        renderDogs();
        dogForm.reset();
        dogForm.removeAttribute('data-id');
      } catch (error) {
        console.error('Error updating dog:', error);
      }
    });
  });
  