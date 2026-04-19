package Messagingservice_Store_notif;
//   to talk directly to MySQL. Everything else goes through here. Important for database team, this is a seperate storage 

//note to self add images to make sure they are entered through clients computer not to be stored in database 

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class MessagingDAO {

//random user I made to test, database people can edit here 
private static final String DB_URL  = "jdbc:mysql://localhost:3307/CommonGround_db";
private static final String DB_USER = "root";
private static final String DB_PASS = "root";

   //open new connection to test
    private Connection getConnection() throws SQLException {
        return DriverManager.getConnection(DB_URL, DB_USER, DB_PASS);
    }

    public void createMessageRecord(MessageRecord message) throws SQLException {

        String sql = "INSERT IGNORE INTO message (conversation_id, sender_id, receiver_id, message_text, sent_at) VALUES (?, ?, ?, ?, CURRENT_TIMESTAMP)";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, message.getConvoId());
            stmt.setInt(2, message.getSender());
            stmt.setInt(3, message.getReceiver());
            stmt.setString(4, message.getContent());


            stmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println("Error sending message: " + e.getMessage());
        }
        
    }

    public List<String[]> getConversation(int convoId) throws SQLException 
    {

        String sql = "SELECT conversation_id, message_text FROM message WHERE conversation_id = ? ORDER BY sent_at";
        List<String[]> messages = new ArrayList<>();

        try (Connection conn = getConnection();
        PreparedStatement stmt = conn.prepareStatement(sql)) 
            {

            stmt.setInt(1, convoId);
            ResultSet rs = stmt.executeQuery();

            while (rs.next()) 
                {
                    messages.add(new String[]
                    {
                        String.valueOf(rs.getInt("conversation_id")),
                        rs.getString("message_text")
                    });
                }
            }
        return messages;
    }

    public void deleteMessageRecord(int convoId, int msgId) throws SQLException {

        String sql = "DELETE FROM message WHERE conversation_id = ? AND message_id = ?";

        try (Connection conn = getConnection();
             PreparedStatement stmt = conn.prepareStatement(sql)) {
            stmt.setInt(1, convoId);
            stmt.setInt(2, msgId);

            stmt.executeUpdate();
        } catch (SQLException e) {
            System.out.println("Error sending message: " + e.getMessage());
        }
        
    }

}
