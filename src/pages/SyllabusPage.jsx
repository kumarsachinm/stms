function SyllabusPage() {
  const syllabus = [
    { grade: 'Class 9', math: ['Number Systems', 'Algebra', 'Geometry', 'Mensuration', 'Statistics'], science: ['Matter', 'Force & Laws', 'Natural Resources', 'Work & Energy'] },
    { grade: 'Class 10', math: ['Real Numbers', 'Polynomials', 'Trigonometry', 'Statistics', 'Probability'], science: ['Chemical Reactions', 'Light', 'Electricity', 'Life Processes'] },
    { grade: 'Class 11', math: ['Sets', 'Relations', 'Trigonometry', 'Calculus', 'Probability'], science: ['Physical Chemistry', 'Motion', 'Thermodynamics', 'Biology fundamentals'] },
    { grade: 'Class 12', math: ['Matrices', 'Determinants', 'Integrals', 'Differential Equations', 'Vectors'], science: ['Electrochemistry', 'Optics', 'Human Physiology', 'Modern Physics'] },
  ]

  return (
    <section className="section-card">
      <div className="section-heading">
        <span className="pill">CBSE Syllabus</span>
        <h3>Mathematics and Science Syllabus from classes 9 to 12</h3>
      </div>
      <div className="syllabus-grid">
        {syllabus.map((item) => (
          <article className="syllabus-block" key={item.grade}>
            <h4>{item.grade}</h4>
            <p><strong>Math</strong> · {item.math.join(', ')}</p>
            <p><strong>Science</strong> · {item.science.join(', ')}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default SyllabusPage
