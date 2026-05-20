package org.example.habitforgeclient.ui.dashboard;

import javax.swing.*;
import java.awt.*;
import java.util.List;
import org.example.habitforgeclient.model.HabitModel;
import org.example.habitforgeclient.ui.components.HabitCard;

public class DashboardPanel extends JPanel {
    private final JPanel listContainer;

    public DashboardPanel() {
        setLayout(new BorderLayout(0, 15));
        setBackground(new Color(11, 14, 20)); // Background utama Gelap
        setBorder(BorderFactory.createEmptyBorder(40, 40, 40, 40));

        // Header Title
        JPanel header = new JPanel(new GridLayout(2, 1, 4, 4));
        header.setOpaque(false);

        JLabel titleLabel = new JLabel("The Grimoire");
        titleLabel.setFont(new Font("Segoe UI", Font.BOLD, 28));
        titleLabel.setForeground(Color.WHITE);

        JLabel subtitleLabel = new JLabel("Chronicle of your discipline and evolving strength.");
        subtitleLabel.setFont(new Font("Segoe UI", Font.PLAIN, 13));
        subtitleLabel.setForeground(new Color(130, 140, 160));

        header.add(titleLabel);
        header.add(subtitleLabel);
        add(header, BorderLayout.NORTH);

        // List Container
        listContainer = new JPanel();
        listContainer.setOpaque(false);
        listContainer.setLayout(new BoxLayout(listContainer, BoxLayout.Y_AXIS));

        JScrollPane scrollPane = new JScrollPane(listContainer);
        scrollPane.setBorder(null);
        scrollPane.setOpaque(false);
        scrollPane.getViewport().setOpaque(false);

        add(scrollPane, BorderLayout.CENTER);
    }

    public void refreshHabits(List<HabitModel> habits, java.util.function.Consumer<Long> checkInAction) {
        listContainer.removeAll();

        for (HabitModel habit : habits) {
            JButton checkInBtn = new JButton("✓");
            checkInBtn.setFocusPainted(false);
            checkInBtn.setFont(new Font("Segoe UI", Font.BOLD, 12));
            checkInBtn.setBackground(new Color(31, 38, 51));
            checkInBtn.setForeground(new Color(52, 152, 219));
            checkInBtn.setBorder(BorderFactory.createLineBorder(new Color(52, 152, 219), 1));
            checkInBtn.setPreferredSize(new Dimension(30, 30));

            checkInBtn.addActionListener(e -> checkInAction.accept(habit.id()));

            HabitCard card = new HabitCard(habit, checkInBtn);
            listContainer.add(card);
            listContainer.add(Box.createVerticalStrut(15));
        }

        listContainer.revalidate();
        listContainer.repaint();
    }
}