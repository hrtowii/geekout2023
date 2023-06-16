import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots

def main():
    st.title("Welcome, Teddy")
    
    ### -------------------------------------------------
    ### charts of student progress in this week
    ### -------------------------------------------------

    ### numerical summary 
    col1, col2, col3 = st.columns([50,20,20])
    col1.write("You are very productive so far this week. Keep it up!")
    col2.metric("Minutes", 420, delta='+30 from last week', delta_color="normal", 
                help="Change in minutes spent studying from last week")
    col3.metric("Questions Done", 50, delta='+20 from last week', delta_color="normal", 
                help="Questions done since last week")

    st.header("Your Progress")


    ### bar chart: minutes spent on videos per day
    df = pd.DataFrame({
        'Day': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        'Minutes': [10, 13, 11, 40, 30, 10, 20],
        'Questions Done': [5, 10, 8, 10, 15, 5, 10]
    })

    fig = make_subplots(specs=[[{"secondary_y": True}]])

    fig.add_trace(go.Bar(
        x=df['Day'],
        y=df['Minutes'],
        name='Minutes Spent on Videos'
    ))

    fig.add_trace(go.Scatter(
        x=df['Day'],
        y=df['Questions Done'],
        name='Questions Done',
    ),
        secondary_y=True
    )

    # Customize the chart
    fig.update_layout(
        title='Time Spent on Videos and Questions Done This Week',
    )
    # Set y-axes titles
    fig.update_yaxes(title_text="Minutes", secondary_y=False)
    fig.update_yaxes(title_text="Questions", secondary_y=True)

    st.plotly_chart(fig, use_container_width=True)

    df = pd.DataFrame({
        'Subject': ['Phy', 'Chem', 'Math', 'Econs'],
        'Strength': [-0.3, 0.2, 0, 0.7],
    })
    fig = px.bar(df, x='Subject', y='Strength', color='Strength', color_continuous_scale='reds', title='Subject Performance This Week')
    st.plotly_chart(fig, use_container_width=True)


    ### Line chart: ratio of questions gotten right per day
    df = pd.DataFrame({
        'Day': ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        'Ratio': [0.5, 0.6, 0.7, 0.8, 0.9, 0.7, 0.8],
    })
    fig = px.line(df, x='Day', y='Ratio', title='Ratio of Questions Gotten Right This Week')
    st.plotly_chart(fig, use_container_width=True)

    


if __name__ == "__main__":
    main()
