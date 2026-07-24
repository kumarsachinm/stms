function TutorsPage({ tutors, authUser }) {
  const visibleTutors = tutors.slice(0, 6)

  return (
    <section className="section-card">
      <div className="section-heading">
        <span className="pill">Tutor profiles</span>
        <h3>{authUser?.role === 'student' ? 'Tutors ready to guide you' : 'Tutors for CBSE Maths and Science Students'}</h3>
      </div>
      <div className="card-grid">
        {visibleTutors.map((tutor) => (
          <article className="profile-card" key={tutor.id}>
            <img src={tutor.photo} alt={tutor.name} />
            <h4>{tutor.name}</h4>
            <p>{tutor.subject} · {tutor.experience} years Experience</p>
            <p>Age {tutor.age} · Classes 9-12</p>
            <p><strong>Topics:</strong> {tutor.topics.join(', ')}</p>
            <p><strong>Charges:</strong> ₹{tutor.hourlyRate}/hour</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default TutorsPage
