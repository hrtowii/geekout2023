import streamlit as st
import pandas as pd
import numpy as np
import plotly.express as px

def main():
    st.title("Welcome, Teddy")
    
    ### -------------------------------------------------
    ### charts of student progress in this week
    ### -------------------------------------------------

    # numerical summary 
    col1, col2, col3 = st.columns([50,20,20])
    col1.write("You are very productive so far this week. Keep it up!")
    col2.metric("Minutes", 420, delta=30, delta_color="normal", 
                help="Change in minutes spent studying from last week")
    col3.metric("Questions Done", 50, delta=20, delta_color="normal", 
                help="Questions done since last week")

    st.header("Your Progress This Week")

    # minutes studied per day
    chart_data = pd.DataFrame(
        [10, 13, 11, 40, 30, 10, 20],
        index = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        columns=['Minutes Studied']
    )
    st.bar_chart(chart_data)

    fig = px.bar(chart_data, x='year', y='pop')
    st.bar_chart(fig)


    # minutes studied for each subject
    chart_data = pd.DataFrame(
        [60, 40, 70, 20],
        index = ['H2 Phy', 'H2 Chem', 'H2 Math', 'H1 Econs'],
        columns=['Minutes Studied']
    )
    st.bar_chart(chart_data)


if __name__ == "__main__":
    main()
